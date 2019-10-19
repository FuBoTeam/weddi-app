import IOTA from 'iota.lib.js';

const MESSAGE_CHECK_FREQUENCY = 15 // seconds
const DATA_STORE_VERSION = 1

// status codes for account and contact public keys (user.keyStatus)
const PUBLICKEY_STATUS_OK = 'ok'
const PUBLICKEY_STATUS_NOT_FOUND = 'not_found'
const PUBLICKEY_STATUS_MULTIPLE_FOUND = 'multiple_found'
const PUBLICKEY_STATUS_ERROR = 'error'
const PUBLICKEY_STATUS_BAD_ADDRESS = 'bad_address'
const PUBLICKEY_STATUS_SENDING = 'sending'

const MAM_ROOT_STATUS_SENDING = 'sending'
const MAM_ROOT_STATUS_SENT = 'sent'
const MAM_ROOT_STATUS_BLOCKED = 'blocked'
const MAM_ROOT_STATUS_ERROR = 'error'

// status codes for outgoing messages (message.status)
const MESSAGE_STATUS_SENT = 'sent'
const MESSAGE_STATUS_NOT_FOUND = 'not_found'
const MESSAGE_STATUS_ERROR = 'error'
const MESSAGE_STATUS_SENDING = 'sending'
const MESSAGE_STATUS_QUEUEING = 'queueing'
const MESSAGE_STATUS_POWING = 'powing'

const MAM_ROOT_TAG = 'MAM9ROOT9999999999999999999'

class Distribution {
  constructor(args) {
    // only support args.provider, args.host, and args.port
    this.iotaServer = new IOTA(args);
    this.iotaServer.api.getNodeInfo((error, success) => {
      if (error) {
        // ignore error msg for POC
        console.error(error);
      } else {
        console.log(success);
      }
    });
  }
  sendTfr(tfr) {
    const address = tfr;
    const message = this.iotaServer.utils.toTrytes('Hello World!');
    const transfers = [{
      value: 0,
      address,
      message
    }];
    this.iotaServer.api.sendTransfer(tfr, 3, 9, transfers, (error, success) => {
      if (error) {
        // ignore error msg for POC
        console.error(error);
      } else {
        console.log(success);
      }
    });
  }
}

export default Distribution;
