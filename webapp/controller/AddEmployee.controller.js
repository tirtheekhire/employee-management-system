sap.ui.define([
  "./BaseController",
  "sap/ui/core/UIComponent",
  "../util/Validation",
  "../service/EmployeeService"
], function (BaseController, UIComponent, Validation, EmployeeService) {
  "use strict";
  return BaseController.extend("com.example.employeeapp.employeeapp.controller.AddEmployee", {

    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("addEmployee").attachPatternMatched(this._onAddMode,this);
      oRouter.getRoute("editEmployee").attachPatternMatched(this._onEditMode,this);
      this._employeePhoto = "";
      this._photoInput = document.createElement("input");
      this._photoInput.type = "file";
      this._photoInput.accept = "image/*";
      this._photoInput.style.display = "none";
      document.body.appendChild(this._photoInput);
      this._photoInput.onchange = this.onPhotoSelected.bind(this);
    },

    // Helper function to generate employee id
    generateEmployeeId: function () {
      var aEmployees = JSON.parse(localStorage.getItem("employees")) || [];
      var sEmployeeId;
      do {
        var random = Math.floor(Math.random() * 10000);
        sEmployeeId = "EMP" + random.toString().padStart(4, "0");
      } while (aEmployees.some(function (oEmployee) {
        return oEmployee.EmployeeId === sEmployeeId;
      }));
      return sEmployeeId;
    },

    //reset input fields
    _onRouteMatched: function () {
      //reset fields
      this.byId("nameInput").setValue("");
      this.byId("emailInput").setValue("");
      this.byId("mobileInput").setValue("");
      this.byId("genderSelect").setSelectedKey("");
      this.byId("dobPicker").setValue("");

      this.byId("departmentSelect").setSelectedKey("");
      this.byId("roleInput").setValue("");
      this.byId("employmentTypeSelect").setSelectedKey("");
      this.byId("statusSelect").setSelectedKey("");
      this.byId("joiningDatePicker").setValue("");
      this.byId("managerInput").setValue("");

      this.byId("address1Input").setValue("");
      this.byId("address2Input").setValue("");
      this.byId("cityInput").setValue("");
      this.byId("stateInput").setValue("");
      this.byId("countryInput").setValue("");
      this.byId("pincodeInput").setValue("");

      this.byId("experienceInput").setValue("");
      this.byId("salaryInput").setValue("");
      this.byId("educationInput").setValue("");
      this.byId("skillsInput").setValue("");
      this.byId("emergencyContactInput").setValue("");
      this.byId("emergencyPhoneInput").setValue("");
      this.byId("bloodGroupSelect").setSelectedKey("");
      this.byId("notesInput").setValue("");
      // reset error message
      this.byId("nameInput").setValueState("None");
      this.byId("emailInput").setValueState("None");
      this.byId("mobileInput").setValueState("None");
      this.byId("genderSelect").setValueState("None");
      this.byId("dobPicker").setValueState("None");

      this.byId("departmentSelect").setValueState("None");
      this.byId("roleInput").setValueState("None");
      this.byId("employmentTypeSelect").setValueState("None");
      this.byId("statusSelect").setValueState("None");
      this.byId("joiningDatePicker").setValueState("None");
      this.byId("managerInput").setValueState("None");

      this.byId("address1Input").setValueState("None");
      this.byId("address2Input").setValueState("None");
      this.byId("cityInput").setValueState("None");
      this.byId("stateInput").setValueState("None");
      this.byId("countryInput").setValueState("None");
      this.byId("pincodeInput").setValueState("None");

      this.byId("experienceInput").setValueState("None");
      this.byId("salaryInput").setValueState("None");
      this.byId("educationInput").setValueState("None");
      this.byId("skillsInput").setValueState("None");
      this.byId("emergencyContactInput").setValueState("None");
      this.byId("emergencyPhoneInput").setValueState("None");
      this.byId("bloodGroupSelect").setValueState("None");
      this.byId("notesInput").setValueState("None");
    },

    // for add functionality
    _onAddMode: function () {
      this._isEditMode = false;
      this._employeeId = null;
      // Generate Employee ID
      this._generatedEmployeeId = this.generateEmployeeId();
      // Show it in the Employee ID field
      this.byId("employeeIdInput").setValue(this._generatedEmployeeId);
      this.byId("employeePage").setTitle("Add Employee");
      this.byId("headingText").setText("Add New Employee");
      this.byId("headingSubText").setText("Create a new employee profile for your organization.")
      this.byId("saveBtn").setText("Save Employee");

      this._employeePhoto = "";
      this.byId("employeeAvatar").setSrc("");
      this.byId("nameInput").setValue("");
      this.byId("emailInput").setValue("");
      this.byId("mobileInput").setValue("");
      this.byId("genderSelect").setSelectedKey("");
      this.byId("dobPicker").setValue("");

      this.byId("departmentSelect").setSelectedKey("");
      this.byId("roleInput").setValue("");
      this.byId("employmentTypeSelect").setSelectedKey("");
      this.byId("statusSelect").setSelectedKey("");
      this.byId("joiningDatePicker").setValue("");
      this.byId("managerInput").setValue("");

      this.byId("address1Input").setValue("");
      this.byId("address2Input").setValue("");
      this.byId("cityInput").setValue("");
      this.byId("stateInput").setValue("");
      this.byId("countryInput").setValue("");
      this.byId("pincodeInput").setValue("");

      this.byId("experienceInput").setValue("");
      this.byId("salaryInput").setValue("");
      this.byId("educationInput").setValue("");
      this.byId("skillsInput").setValue("");
      this.byId("emergencyContactInput").setValue("");
      this.byId("emergencyPhoneInput").setValue("");
      this.byId("bloodGroupSelect").setSelectedKey("");
      this.byId("notesInput").setValue("");
    },

    // for edit functionality
    _onEditMode: function (oEvent) {
      this._isEditMode = true;
      var sId = oEvent.getParameter("arguments").employeeId;
      var oModel = this.getView().getModel();
      var aEmployees = oModel.getProperty("/employees");
      var oEmployee = aEmployees.find(emp => emp.EmployeeId == sId);
      this._employeeId = sId;
      this._employeePhoto = oEmployee.Photo || "";
      this.byId("employeeAvatar").setSrc(oEmployee.Photo);
      this.byId("employeeIdInput").setValue(oEmployee.EmployeeId);
      this.byId("employeePage").setTitle("Edit Employee");
      this.byId("saveBtn").setText("Update Employee");

      this.byId("nameInput").setValue(oEmployee.Name);
      this.byId("emailInput").setValue(oEmployee.Email);
      this.byId("mobileInput").setValue(oEmployee.Mobile);
      this.byId("genderSelect").setSelectedKey(oEmployee.Gender || "");
      this.byId("dobPicker").setValue(oEmployee.DateOfBirth);

      this.byId("departmentSelect").setSelectedKey(oEmployee.Department || "");
      this.byId("roleInput").setValue(oEmployee.Role);
      this.byId("employmentTypeSelect").setSelectedKey(oEmployee.EmploymentType || "");
      this.byId("statusSelect").setSelectedKey(oEmployee.Status || "");
      this.byId("joiningDatePicker").setValue(oEmployee.JoiningDate);
      this.byId("managerInput").setValue(oEmployee.Manager);

      this.byId("address1Input").setValue(oEmployee.Address1);
      this.byId("address2Input").setValue(oEmployee.Address2);
      this.byId("cityInput").setValue(oEmployee.City);
      this.byId("stateInput").setValue(oEmployee.State);
      this.byId("countryInput").setValue(oEmployee.Country);
      this.byId("pincodeInput").setValue(oEmployee.Pincode);

      this.byId("experienceInput").setValue(oEmployee.Experience);
      this.byId("salaryInput").setValue(oEmployee.Salary);
      this.byId("educationInput").setValue(oEmployee.Education);
      this.byId("skillsInput").setValue(oEmployee.Skills);
      this.byId("emergencyContactInput").setValue(oEmployee.EmergencyContact);
      this.byId("emergencyPhoneInput").setValue(oEmployee.EmergencyPhone);
      this.byId("bloodGroupSelect").setSelectedKey(oEmployee.BloodGroup);
      this.byId("notesInput").setValue(oEmployee.Notes);

      this.byId("saveBtn").setText("Update Employee");
      this.byId("headingText").setText("Update Employee");
      this.byId("headingSubText").setText(" ");
    },

    // back button
    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("employeeList");
    },
    
    // edit/update employee
    onSaveEmployee: function () {
      var oModel = this.getModel();
      // personal info
      var sName = this.capitalizeWords(this.byId("nameInput").getValue().trim());
      var email = this.byId("emailInput").getValue().trim();
      var mob = this.byId("mobileInput").getValue().trim();
      var gender = this.byId("genderSelect").getSelectedKey();
      var dob = this.byId("dobPicker").getValue();
      //Job Information
      var department = this.byId("departmentSelect").getSelectedKey();
      var sRole = this.capitalizeWords(this.byId("roleInput").getValue().trim());
      var empType = this.byId("employmentTypeSelect").getSelectedKey();
      var status = this.byId("statusSelect").getSelectedKey();
      var joiningDate = this.byId("joiningDatePicker").getValue();
      var manager = this.capitalizeWords(this.byId("managerInput").getValue().trim());
      //Address
      var add1 = this.byId("address1Input").getValue().trim();
      var add2 = this.byId("address2Input").getValue().trim();
      var city = this.capitalizeWords(this.byId("cityInput").getValue().trim());
      var state = this.capitalizeWords(this.byId("stateInput").getValue().trim());
      var country = this.capitalizeWords(this.byId("countryInput").getValue().trim());
      var pin = this.byId("pincodeInput").getValue().trim();
      // Professional Information
      var exp = this.byId("experienceInput").getValue().trim();
      var sal = this.byId("salaryInput").getValue().trim();
      var edu = this.byId("educationInput").getValue().trim();
      var skills = this.byId("skillsInput").getValue().trim();
      var emerContact = this.capitalizeWords(this.byId("emergencyContactInput").getValue().trim());
      var emerPhone = this.byId("emergencyPhoneInput").getValue().trim();
      var bloodG = this.byId("bloodGroupSelect").getSelectedKey();
      var notes = this.byId("notesInput").getValue().trim();
      // employee object
      var oEmployee = {
        // Personal Information
        EmployeeId: this._isEditMode ? this._employeeId : this._generatedEmployeeId,
        Photo: this._employeePhoto || "",
        Name: sName,
        Email: email,
        Mobile: mob,
        Gender: gender,
        DateOfBirth: dob,
        //Job Information
        Department: department,
        Role: sRole,
        EmploymentType: empType,
        Status: status,
        JoiningDate: joiningDate,
        Manager: manager,
        //Address
        Address1: add1,
        Address2: add2,
        City: city,
        State: state,
        Country: country,
        Pincode: pin,
        // Professional Information
        Experience: exp,
        Salary: sal,
        Education: edu,
        Skills: skills,
        EmergencyContact: emerContact,
        EmergencyPhone: emerPhone,
        BloodGroup: bloodG,
        Notes: notes,
      };
      if (!Validation.validateEmployeeForm(this)) {
        return;
      }
      if (this._isEditMode) {
        EmployeeService.updateEmployee(oModel, oEmployee);
        this.showToast("Employee updated successfully");
      } else {
        EmployeeService.addEmployee(oModel, oEmployee);
        this.showToast("Employee added successfully");
      }
      this.updateCounts();
      this.getOwnerComponent().getRouter().navTo("employeeList");
    },

    onInputValidation: function (oEvent) {
      var oControl = oEvent.getSource();
      if (!oControl.getValue().trim()) {
        oControl.setValueState("Error");
        oControl.setValueStateText("This field is required");
      } else {
        oControl.setValueState("None");
      }
    },

    onSelectValidation: function (oEvent) {
      var oControl  = oEvent.getSource();
      if (!oControl.getSelectedKey()) {
        oControl.setValueState("Error");
        oControl.setValueStateText("Please select a value");
      } else {
        oControl.setValueState("None");
      }
    },

    onDateValidation: function (oEvent) {
      var oControl = oEvent.getSource();
      if (!oControl.getValue()) {
        oControl.setValueState("Error");
        oControl.setValueStateText("Please select a date");
      } else {
        oControl.setValueState("None");
      }
    },

    capitalizeWords: function (sText) {
      return sText
        .toLowerCase()
        .split(" ")
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
    
    // open file picker for photo upload
    onUploadPhoto: function () {
      this._photoInput.value = "";
      this._photoInput.click();
    },

    onPhotoSelected: function (oEvent) {

    var oFile = oEvent.target.files[0];

    if (!oFile) {
        return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {

        var img = new Image();

        img.onload = function () {

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            var SIZE = 150;

            canvas.width = SIZE;
            canvas.height = SIZE;

            // Determine the largest centered square
            var cropSize = Math.min(img.width, img.height);

            var sx = (img.width - cropSize) / 2;
            var sy = (img.height - cropSize) / 2;

            // Crop + Resize
            ctx.drawImage(
                img,
                sx,
                sy,
                cropSize,
                cropSize,
                0,
                0,
                SIZE,
                SIZE
            );

            // Compress
            var compressedImage = canvas.toDataURL(
                "image/jpeg",
                0.7
            );

            this._employeePhoto = compressedImage;

            this.byId("employeeAvatar")
                .setSrc(compressedImage);

        }.bind(this);

        img.src = e.target.result;

    }.bind(this);

    reader.readAsDataURL(oFile);

},
  });
});