angular.module('dataFormat', [])
    .factory('dataFormat',[
        function() {

            var service = {
                format:function (data) {
                    var temp = data;
                    for (var line=0;line<temp.length;line++){
                        var tempName = temp[line].name;
                        for(line-=-1;;line++ ){
                            if (line == temp.length){
                                break;
                            }
                            if(temp[line].name==tempName){
                                temp[line].hide = true;
                            }else{
                                line-=1;
                                break;
                            }
                        }
                    }
                    return temp;
                }
            };

            return service;
        }]);