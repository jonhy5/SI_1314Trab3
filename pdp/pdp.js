/**
 * Created by André Jonas on 08-12-2013.
 */

var fs = require("fs");

/*====================================================================================
    RBAC L1 entities
 */
var roles,
    users,
    permissions,
    userAssignments,
    permissionAssignments;


/*====================================================================================
    Extract Roles, Users, Permissions, User Assignments, Permission Assignments
    and create properties with their ID's

    Ex:
    var roles = {
        "admin" : {
            "id": "admin",
            "description": "System administrator",
            "juniorRoles": ["auth"]
        },
        ...
    };
 */

function extractPermissionAssignments(file){
    function inheritedPermissions(roleId){
        var permissions = permissionAssignments[roleId] || [];
        for(id in roles[roleId].juniorRoles){
            var juniorRole = roles[roleId].juniorRoles[id];
            if(permissionAssignments[juniorRole] != undefined){
                permissions = permissions.concat(inheritedPermissions(juniorRole));
            }
        }
        return permissions;
    }

    // permission assignments from file
    var permissionAssignments = file.permissionAssignments;

    // inherited permissions
    for(roleId in permissionAssignments){
        permissionAssignments[roleId] = inheritedPermissions(roleId);
    }
    return permissionAssignments;
}

function extend(obj1, obj2){
    for(prop in obj2){
        if(obj2.hasOwnProperty(prop)){
            obj1[prop] = obj2[prop];
        }
    }
}

function extractUsers(file){
    users = file.users;
    for(userId in users){
        users[userId].resources = {};
        for(i in userAssignments[userId]){
            var roleId= userAssignments[userId][i];
            for(j in permissionAssignments[roleId]){
                var permissionId = permissionAssignments[roleId][j];
                //console.log(userId + ' ' + roleId + ' ' + permissionId);
                extend(users[userId].resources, permissions[permissionId].resources);
            }
        }
    }

    return users;
}


/* ===================================================================================
    API
 */

/**
 * Loads policy file synchronously
 * @param path
 */
module.exports.loadPolicy = function(path){
    var file = JSON.parse(fs.readFileSync(path)); // Sync because we need all policies loaded b4 continuing.


    // extraction
    roles = file.roles;
    permissions = file.permissions;
    userAssignments = file.userAssignments;
    permissionAssignments = extractPermissionAssignments(file);
    users = extractUsers(file);

    console.log("Policies file loaded.");
};

/**
 * Checks if user can acces the specified resource
 * @param user
 * @param resource
 */
module.exports.canAccess = function(user, operation, resource){
    if(users[user] != undefined && userAssignments[user] != undefined){
        for(i in users[user].resources[resource]){
            var operationId = users[user].resources[resource][i];
            if(operationId == operation)
                return true;
        }
    }
    return false;
};


/* ===================================================================================
    FOR DEBUG PURPOSES ONLY
 */

module.exports.debug = false;
module.exports.getRoles = function(){if(module.exports.debug) return roles;}
module.exports.getUsers = function(){if(module.exports.debug) return users;}
module.exports.getPermissions = function(){if(module.exports.debug) return permissions;}
module.exports.getUserAssignments = function(){if(module.exports.debug) return userAssignments;}
module.exports.getPermissionAssignments = function(){if(module.exports.debug) return permissionAssignments;}

