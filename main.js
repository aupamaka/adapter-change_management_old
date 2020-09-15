// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

  /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */

  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.
    this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect() {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.
    this.healthcheck();
    console.info("In healthcheck ***");
  }

  /**
 * @memberof ServiceNowAdapter
 * @method healthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 *   Calls method emitOnline if external system is available.
 *
 * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
 *   that handles the response.
 */
healthcheck(callback) {
    console.info("Here 1 - In healthcheck");
    log.info("Here 2 - In healthcheck");
 this.getRecord((result, error) => {
   /**
    * For this lab, complete the if else conditional
    * statements that check if an error exists
    * or the instance was hibernating. You must write
    * the blocks for each branch.
    */
   //let callbackError = null;
   //let callbackMessage = null;

   if (error) {
     /**
      * Write this block.
      * If an error was returned, we need to emit OFFLINE.
      * Log the returned error using IAP's global log object
      * at an error severity. In the log message, record
      * this.id so an administrator will know which ServiceNow
      * adapter instance wrote the log message in case more
      * than one instance is configured.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing the error seen as an argument
      * for the callback's errorMessage parameter.
      */
      this.emitOffline();
      console.error(`\nError returned from healthcheck:\n${this.id}--${JSON.stringify(error)}`);
      //callbackError=error;
      //callback(callbackMessage, callbackError);

   } else {
     /**
      * Write this block.
      * If no runtime problems were detected, emit ONLINE.
      * Log an appropriate message using IAP's global log object
      * at a debug severity.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing this function's result
      * parameter as an argument for the callback function's
      * responseData parameter.
      */
      this.emitOnline();
      console.info(`\nMessage returned from healthcheck:\n${this.id}--${JSON.stringify(result)}`);
      //callbackMessage=result;
      //callback(callbackMessage, callbackError);
   }
 });
}

  /**
   * @memberof ServiceNowAdapter
   * @method emitOffline
   * @summary Emit OFFLINE
   * @description Emits an OFFLINE event to IAP indicating the external
   *   system is not available.
   */
  emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  getRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's get() method.
     * Note how the object was instantiated in the constructor().
     * get() takes a callback function.
     */
     console.info("In getRecord() - AU");
    this.connector.get((results, error) => 
    	{
            console.info("In getRecord() - AU - 1");
            let returnArray = new Array();
            if (results === null) 
            {
                callback(results, error);
            }
            else //if(results) 
            {
                     console.info("In getRecord() if(results)");

                var resultsString = JSON.stringify(results);
                //console.info(`In getRecord() if(results)${resultsString.result}`);
                console.info(`In getRecord() if(results)${resultsString}`);
                var bString = JSON.parse(resultsString); 
                console.info(`In getRecord() bString ${bString}`);
                var pString = JSON.parse(bString.body); 
                console.info("In getRecord() pString"+JSON.stringify(pString.result));
                for(var i in pString.result)
                {
                        console.log("i is " + i);
                        //console.log("pString is " + pString);
                        console.log("pString is " + pString.result[0]);
                        var standardizedTicket = 
                        "{" +"\"change_ticket_number\":"+ 
                            JSON.stringify(pString.result[i].number) + "," +"\"active\":"+ 
                            JSON.stringify(pString.result[i].active) + "," +"\"priority\":"+ 
                            JSON.stringify(pString.result[i].priority) + "," +"\"work_start\": "+ 
                            JSON.stringify(pString.result[i].work_start) + "," +"\"work_end\": "+ 
                            JSON.stringify(pString.result[i].work_end) + "," +"\"description\": "+ 
                            JSON.stringify(pString.result[i].description) + "," +"\"change_ticket_key\": "+ 
                            JSON.stringify(pString.result[i].sys_id) + "}";

                            var parsedStandardTicket = JSON.parse(standardizedTicket);
                            newTicketArray.result.push(parsedStandardTicket);
                }
                console.info(`\naupamaka :: Response returned after GET request:\n${returnArray}`);
                //callback(returnArray, error);
            }
        }
   );
 }

  /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  postRecord(callback) {
           console.info("In postRecord()");

    this.connector.post((results, error) => {
            let result;
             if (results === null)
            {
                callback(result, error);
            } 
            else if (results) {
                if (results.body) {
                    var returnData = JSON.parse(results.body);

                    result = {
                        change_ticket_number: returnData.result.number,
                        active: returnData.result.active,
                        priority: returnData.result.priority,
                        description: returnData.result.description,
                        work_start: returnData.result.work_start,
                        work_end: returnData.result.work_end,
                        change_ticket_key: returnData.result.sys_id
                    };

                    callback(result, error);
                    //log.info(`\nResponse returned from Post request:\n${JSON.stringify(result)}`);
                }
            }
    });
    /*
    const cb = (callback.results, callback.error);
    connector.post(options, cb => {
    if (error) {
        console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
        }
        console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`);
    });
    */
  }
}

module.exports = ServiceNowAdapter;