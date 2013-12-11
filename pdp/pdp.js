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

function extractIndexedRoles(file){
    var roles = {};
    for (k in file.roles){
        var role = file.roles[k];
        roles[role.id] = role;
    }
    return roles;
}
function extractIndexedUsers(file){
    var users = {};
    for (k in file.users){
        var user = file.users[k];
        users[user.id] = user;
    }
    return users;
}
function extractIndexedPermissions(file){
    var permissions = {};
    for (k in file.permissions){
        var permission = file.permissions[k];
        permissions[permission.id] = permission;
    }
    return permissions;
}
function extractIndexedUserAssignments(file){
    var userAssignments = {};
    for(k in file.userAssignments){
        var userAssignment = file.userAssignments[k];
        userAssignments[userAssignment.user] = userAssignment;
    }
    return userAssignments;
}
function extractIndexedPermissionAssignments(file, roles){
    function inheritedPermissions(roleId){
        var permissions = permissionAssignments[roleId].permissions || [];
        for(id in roles[roleId].juniorRoles){
            var juniorRole = roles[roleId].juniorRoles[id];
            if(permissionAssignments[juniorRole] != undefined){
                permissions = permissions.concat(inheritedPermissions(juniorRole));
            }
        }
        return permissions;
    }

    // permission assignments from file
    var permissionAssignments = {};
    for(k in file.permissionAssignments){
        var permissionAssignment = file.permissionAssignments[k];
        permissionAssignments[permissionAssignment.role] = permissionAssignment;
    }

    // inherited permissions
    for(roleId in permissionAssignments){
        var permissionAssignment = permissionAssignments[roleId];
        permissionAssignment.permissions = inheritedPermissions(roleId);
    }
    return permissionAssignments;
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
    roles = extractIndexedRoles(file);
    users = extractIndexedUsers(file);
    permissions = extractIndexedPermissions(file);
    userAssignments = extractIndexedUserAssignments(file);
    permissionAssignments = extractIndexedPermissionAssignments(file, roles);
};

/**
 * Checks if user can acces the specified resource
 * @param user
 * @param resource
 */
module.exports.canAccess = function(user, operation, resource){
    if(userAssignments[user] != undefined){
        for(i in userAssignments[user].roles){

            var role = userAssignments[user].roles[i];
            for(j in permissionAssignments[role].permissions){

                var permission = permissionAssignments[role].permissions[j];
                for(k in permissions[permission].resources){

                    var res =  permissions[permission].resources[k];
                    if(res.resource == resource && res.operation == operation){
                        return true;
                    }
                }
            }
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

