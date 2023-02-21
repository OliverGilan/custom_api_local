const express = require('express')
const capi = express.Router()
var bodyParser = require('body-parser')

capi.use(bodyParser.json())

capi.get('/', (req, res) => {
  res.json('ping')
})

capi.post('/', (req, res) => {
  let body = req.body
  // console.log(req.headers.authorization)
  console.log(JSON.stringify(body))
  let method = body['method']
  let params = body['params']
  let id = body['id']
  
  // res.set('X-RateLimit-Limit', '3')

  let result = (() => {
    switch(method){
      case "test_connection":
        return test_connection();
      case "list_objects":
        return list_objects();
      case "supported_operations":
        return supported_operations();
      case "list_fields":
        return list_fields("");
      case "get_sync_speed":
        return get_sync_speed();
      case "sync_batch":
        console.log(method, params['sync_plan'])
        return sync_batch(params['sync_plan'], params['sync_plan']['operation'], params['sync_plan']['schema'], params['records']);
      default:
        throw "WTF";
    }
  })();

  response = {
    "jsonrpc": "2.0",
    "id": id,
    "result": result
  }
  res.json(response)
})

function test_connection() {
  return {"success": true}
}

function list_objects(){
  return {
    "objects": [
      {
        "object_api_name": "restaurant",
        "label": "Restaurants",
      },
      {
        "object_api_name": "venue", 
        "label": "Concert Venues"
      },
      {
        "object_api_name": "reservation", 
        "label": "Reservation",
        "can_create_fields": "on_write"
      },
    ]
  }
}

function supported_operations(){
  return {
    "operations": ["upsert", "update", 'mirror'],
  }
}

function list_fields(field_name){
  return {
    "fields": [
      {
        "field_api_name": "name",
        "label": "Name",
        "identifier": true,
        "required": true,
        "createable": true,
        "updateable": true,
        "type": "integer",
        "array": false,
      },
      {
        "field_api_name": "outdoor_dining",
        "label": "Outdoor Dining?",
        "identifier": false,
        "required": false,
        "createable": true,
        "updateable": true,
        "type": "boolean",
        "array": false,
      },
      {
        "field_api_name": "zip",
        "label": "ZIP Code",
        "identifier": false,
        "required": false,
        "createable": true,
        "updateable": true,
        "type": "decimal",
        "array": false,
      },
      {
        "field_api_name": "tag_list",
        "label": "Tags",
        "identifier": false,
        "required": true,
        "createable": true,
        "updateable": true,
        "type": "string",
        "array": false,
      }
    ]
  }
}

function get_sync_speed(){
  return {
    "maximum_batch_size": 10,
    "maximum_parallel_batches": 10,
    "maximum_records_per_second": 100,
  }
}

function sync_batch(sync_plan, operation, schema, records){
  console.log(`executing ${operation} with sync plan: ${sync_plan}`)
  let activeIdentifier = Object.keys(schema).find(key => {
    let column = schema[key]
    return column.active_identifier === true
  })
  let results = records.map(r => {return { "identifier": r[activeIdentifier], "success": true }})

  return {
    "record_results": results
    // "record_results": [
    //   {
    //     "identifier": "Ashley's",
    //     "success": true
    //   },
    //   {
    //     "identifier": "Seva",
    //     "success": true
    //   },
    //   {
    //     "identifier": "Pizza House",
    //     "success": false,
    //     "error_message": "API Error, please retry"
    //   },
    //   {
    //     "identifier": "Zingerman's Delicatessen",
    //     "success": true
    //   },
    //   {
    //     "identifier": "Gandy Dancer",
    //     "success": false,
    //     "error_message": "Exceeded tag limit of 3"
    //   }
    // ]
  }
}

module.exports = capi