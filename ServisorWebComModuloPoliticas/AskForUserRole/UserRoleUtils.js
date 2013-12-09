/**
 * Created by Jonhy-Ptr on 09-12-2013.
 */


module.exports.AskRole = function(req,res){
    if(ValidateUser(req,res)){
        return true;
    }
}


/**
 * @return {boolean}
 */
function ValidateUser(req,res){
    return true;
}