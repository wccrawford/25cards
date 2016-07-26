export default class GoogleCast {
    constructor() {
        this.applicationID = 'E89FB184';
        this.namespace = 'urn:x-cast:us.eyen.25cards';
        this.castSession = null;
        this.viewerUrl = null;

        if (!chrome.cast || !chrome.cast.isAvailable) {
            setTimeout(this.initializeCastApi.bind(this), 1000);
        }
    }

    setViewerUrl(url) {
        this.viewerUrl = url;

        if(this.castSession) {
            this.sendMessage(this.viewerUrl);
        }
    }

    initializeCastApi() {
        var castSessionRequest = new chrome.cast.SessionRequest(this.applicationID);
        var apiConfig = new chrome.cast.ApiConfig(castSessionRequest,
            this.castSessionListener.bind(this),
            this.receiverListener.bind(this));
        chrome.cast.initialize(apiConfig, this.onInitSuccess.bind(this), this.onError);
    }

    onInitSuccess() {
        if(this.viewerUrl) {
            this.setViewerUrl(this.viewerUrl);
        }
    }

    onError(message) {
        // console.log('error', message);
    }

    onSuccess(message) {
        // console.log("onSuccess: "+message);
    }

    onStopAppSuccess() {
        // console.log('onStopAppSuccess');
    }

    castSessionListener(e) {
        this.castSession = e;
        this.castSession.addUpdateListener(this.castSessionUpdateListener.bind(this));
        this.castSession.addMessageListener(this.namespace, this.receiverMessage.bind(this));
    }

    castSessionUpdateListener(isAlive) {
        if (!isAlive) {
            this.castSession = null;
        } else {
            this.setViewerUrl(this.viewerUrl);
        }
    }

    receiverMessage(namespace, message) {
        // console.log("receiverMessage: "+namespace+", "+message);
    }

    receiverListener(e) {
        // if( e === 'available' ) {
        //     console.log("receiver found");
        // }
        // else {
        //     console.log("receiver list empty");
        // }
    }

    stopApp() {
        this.castSession.stop(this.onStopAppSuccess, this.onError);
    }

    sendMessage(message) {
        if (this.castSession!=null) {
            this.castSession.sendMessage(this.namespace, message, this.onSuccess.bind(this, "Message sent: " + message), this.onError);
        }
        else {
            chrome.cast.requestSession((e) => {
                this.castSession = e;
                this.castSession.sendMessage(this.namespace, message, this.onSuccess.bind(this, "Message sent: " + message), this.onError);
            }, this.onError);
        }
    }
}
