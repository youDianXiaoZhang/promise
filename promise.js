(function(){
    var PENDING = "pending";
    var RESOLVED = "resolved";
    var REJECTED = "rejected";

    function Promise(excutor){
        const _this = this;
        _this.status = PENDING;
        _this.data = "";
        _this.callback = [];

        function resolve(value){
            if(_this.status !== "pending") return;
            _this.status = RESOLVED;
            _this.data = value;

            if(_this.callback.length > 0){
                setTimeout(() => {
                    _this.callback[0].onResolved();
                })
            }
        }

        function reject(value){
            if(_this.status !== "pending") return;
            _this.status = REJECTED;
            _this.data = value;

            if(_this.callback.length > 0){
                setTimeout(() => {
                    _this.callback[0].onRejected();
                })
            }
        }

        try {
            excutor(resolve,reject);
        } catch (error) {
            reject(error);
        }
    }


    Promise.prototype.then = function(onResolved,onResolved){
        const _this = this;

        onResolved = typeof onResolved === "function" ? onResolved : value => value
        onResolved = typeof onResolved === "function" ? onResolved : reason => {throw reason}

        return new Promise((resolve,reject) => {
            var handle = function (callback) {
                setTimeout(() => {
                    try {
                        var result = callback(_this.value);

                        if(result instanceof Promise){
                            result.then(
                                value => resolve(value),
                                reason => reject(reason)
                            );
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
            }

            if(_this.status == RESOLVED){
                handle(onResolved);
            } else if(_this.status == REJECTED){
                handle(onResolved);
            } else {
                _this.callback.push({
                    onResolved(){
                        handle(onResolved);
                    },
                    onRejected(){
                        handle(onResolved);
                    }
                })
            }
        })
    }


    window.Promise = Promise
})(window)























