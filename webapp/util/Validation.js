sap.ui.define([], function () {
    "use strict";

    return {

        validateEmployeeForm: function (oController) {

            var bValid = true;

            // Controls

            var oName = oController.byId("nameInput");
            var oEmail = oController.byId("emailInput");
            var oMobile = oController.byId("mobileInput");
            var oGender = oController.byId("genderSelect");

            var oDepartment = oController.byId("departmentSelect");
            var oRole = oController.byId("roleInput");
            var oEmployment = oController.byId("employmentTypeSelect");
            var oStatus = oController.byId("statusSelect");
            var oJoining = oController.byId("joiningDatePicker");

            // Values

            var sName = oName.getValue().trim();
            var sEmail = oEmail.getValue().trim();
            var sMobile = oMobile.getValue().trim();
            var sRole = oRole.getValue().trim();

            // ===========================
            // Name
            // ===========================

            if (!sName) {

                oName.setValueState("Error");
                oName.setValueStateText("Full Name is required");
                bValid = false;

            } else if (sName.length < 3) {

                oName.setValueState("Error");
                oName.setValueStateText("Name should contain at least 3 characters");
                bValid = false;

            } else {

                oName.setValueState("None");

            }

            // ===========================
            // Email
            // ===========================

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!sEmail) {

                oEmail.setValueState("Error");
                oEmail.setValueStateText("Email is required");
                bValid = false;

            } else if (!emailRegex.test(sEmail)) {

                oEmail.setValueState("Error");
                oEmail.setValueStateText("Enter a valid email address");
                bValid = false;

            } else {

                oEmail.setValueState("None");

            }

            // ===========================
            // Mobile
            // ===========================

            var mobileRegex = /^[6-9]\d{9}$/;

            if (!sMobile) {

                oMobile.setValueState("Error");
                oMobile.setValueStateText("Mobile number is required");
                bValid = false;

            } else if (!mobileRegex.test(sMobile)) {

                oMobile.setValueState("Error");
                oMobile.setValueStateText("Enter a valid 10-digit mobile number");
                bValid = false;

            } else {

                oMobile.setValueState("None");

            }

            // ===========================
            // Gender
            // ===========================

            if (!oGender.getSelectedKey()) {

                oGender.setValueState("Error");
                oGender.setValueStateText("Select Gender");
                bValid = false;

            } else {

                oGender.setValueState("None");

            }

            // ===========================
            // Department
            // ===========================

            if (!oDepartment.getSelectedKey()) {

                oDepartment.setValueState("Error");
                oDepartment.setValueStateText("Select Department");
                bValid = false;

            } else {

                oDepartment.setValueState("None");

            }

            // ===========================
            // Role
            // ===========================

            if (!sRole) {

                oRole.setValueState("Error");
                oRole.setValueStateText("Role is required");
                bValid = false;

            } else {

                oRole.setValueState("None");

            }

            // ===========================
            // Employment Type
            // ===========================

            if (!oEmployment.getSelectedKey()) {

                oEmployment.setValueState("Error");
                oEmployment.setValueStateText("Select Employment Type");
                bValid = false;

            } else {

                oEmployment.setValueState("None");

            }

            // ===========================
            // Status
            // ===========================

            if (!oStatus.getSelectedKey()) {

                oStatus.setValueState("Error");
                oStatus.setValueStateText("Select Status");
                bValid = false;

            } else {

                oStatus.setValueState("None");

            }

            // ===========================
            // Joining Date
            // ===========================

            if (!oJoining.getValue()) {

                oJoining.setValueState("Error");
                oJoining.setValueStateText("Joining Date is required");
                bValid = false;

            } else {

                oJoining.setValueState("None");

            }

            return bValid;

        }

    };

});