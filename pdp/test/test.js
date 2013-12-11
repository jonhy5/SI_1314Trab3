/**
 * Created by André Jonas on 08-12-2013.
 */

var should = require('should'),
    pdp = require('../pdp');


pdp.loadPolicy("./test/policies.json");
// set debug to true
pdp.debug = true;

describe("pdp.js", function(){
    it("should fetch the policies file", function(){
        should(pdp.getRoles()).not.be.undefined;
        should(pdp.getUsers()).not.be.undefined;
        should(pdp.getPermissions()).not.be.undefined;
        should(pdp.getUserAssignments()).not.be.undefined;
        should(pdp.getPermissionAssignments()).not.be.undefined;
    });

    it("ana should access to GET /addUsers.js", function(){
        pdp.canAccess("ana", "GET", "addUsers.js").should.be.true;
    });

    it("ana should access to POST /addUsers.js", function(){
        pdp.canAccess("ana", "POST", "addUsers.js").should.be.true;
    });

    it("ana should not access to GET /not_exists.js", function(){
        pdp.canAccess("ana", "GET", "not_exists.js").should.be.false;
    });

    it("unknown should not access authenticated pages", function(){
        pdp.canAccess("unknown", "GET", "index.js").should.be.false;
    });

    it("unknown should access registration page", function(){
        pdp.canAccess("unknown", "GET", "auth.js").should.be.true;
    });

    it("ana should access registration page as well", function(){
        pdp.canAccess("ana", "GET", "auth.js").should.be.true;
    });

});
