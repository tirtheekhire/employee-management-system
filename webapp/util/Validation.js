sap.ui.define([], function () {
  "use strict";
  return {
   	validateEmployeeForm: function (oController) {
			var oNameInput = oController.byId("nameInput");
			var oRoleInput = oController.byId("roleInput");
			var oStatusSelect = oController.byId("statusSelect");
			var sName = oNameInput.getValue().trim();
			var sRole = oRoleInput.getValue().trim();
			var sStatus = oStatusSelect.getSelectedKey();
			var bValid = true;
    	// Name Validation
      if (!sName) {
				oNameInput.setValueState("Error");
				oNameInput.setValueStateText("Employee name is required");
				bValid = false;
			} else if (sName.length < 3) {
				oNameInput.setValueState("Error");
				oNameInput.setValueStateText("Name must be at least 3 characters");
				bValid = false;
			} else {
				oNameInput.setValueState("None");
			}
      // Role Validation
			if (!sRole) {
				oRoleInput.setValueState("Error");
				oRoleInput.setValueStateText("Role is required");
				bValid = false;
			} else if (sRole.length < 2) {
				oRoleInput.setValueState("Error");
				oRoleInput.setValueStateText("Role must be at least 2 characters");
				bValid = false;
			} else {
				oRoleInput.setValueState("None");
			}
      // Status Validation
			if (!sStatus) {
				oStatusSelect.setValueState("Error");
				oStatusSelect.setValueStateText("Please select a status");
				bValid = false;
			} else {
				oStatusSelect.setValueState("None");
			}
      return bValid;
    }
  };
});