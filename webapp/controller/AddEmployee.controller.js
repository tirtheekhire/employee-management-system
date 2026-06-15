sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/m/MessageToast"
], function (Controller, UIComponent, MessageToast) {
  "use strict";
  return Controller.extend("com.example.employeeapp.employeeapp.controller.AddEmployee", {

    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("addEmployee").attachPatternMatched(this._onAddMode,this);
      oRouter.getRoute("editEmployee").attachPatternMatched(this._onEditMode,this);
    },

    //reset input fields
    _onRouteMatched: function () {
      this.byId("nameInput").setValue("");
      this.byId("roleInput").setValue("");
      this.byId("nameInput").setValueState("None");
      this.byId("roleInput").setValueState("None");
    },

    // for add functionality
    _onAddMode: function () {
      this._isEditMode = false;
      this._employeeId = null;
      this.byId("employeePage").setTitle("Add Employee");
      this.byId("saveBtn").setText("Save Employee");
      this.byId("nameInput").setValue("");
      this.byId("roleInput").setValue("");
      this.byId("nameInput").setValueState("None");
      this.byId("roleInput").setValueState("None");
      this.byId("saveBtn").setText("Save Employee");
    },

    // for edit functionality
    _onEditMode: function (oEvent) {
      this._isEditMode = true;
      var sId = oEvent.getParameter("arguments").employeeId;
      var oModel = this.getView().getModel();
      var aEmployees = oModel.getProperty("/employees");
      var oEmployee = aEmployees.find(emp => emp.id == sId);
      this._employeeId = sId;
      this.byId("employeePage").setTitle("Edit Employee");
      this.byId("saveBtn").setText("Update Employee");
      this.byId("nameInput").setValue(oEmployee.name);
      this.byId("roleInput").setValue(oEmployee.role);
      this.byId("saveBtn").setText("Update Employee");
    },

    // back button
    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("employeeList");
    },
    
    // on click save/edit button
    onSaveEmployee: function () {
      var oNameInput = this.byId("nameInput");
      var oRoleInput = this.byId("roleInput");
      var sName = oNameInput.getValue().trim();
      sName = this.capitalizeWords(sName);
      var sRole = oRoleInput.getValue().trim();
      sRole = this.capitalizeWords(sRole);
      var bValid = true;
      if (!sName) {
        oNameInput.setValueState("Error");
        oNameInput.setValueStateText("Employee name is required");
        bValid = false;
      } else {
        oNameInput.setValueState("None");
      }
      if (!sRole) {
        oRoleInput.setValueState("Error");
        oRoleInput.setValueStateText("Role is required");
        bValid = false;
      } else {
        oRoleInput.setValueState("None");
      }
      if (!bValid) {
        return;
      }
      var oModel = this.getView().getModel();
      var aEmployees = oModel.getProperty("/employees");
      if (this._isEditMode) {
        var oEmployee = aEmployees.find(emp => emp.id == this._employeeId);
        if (oEmployee) {
          oEmployee.name = sName;
          oEmployee.role = sRole;
        }
        oModel.setProperty("/employees", aEmployees);
        this.getOwnerComponent().updateRoles();
        MessageToast.show("Employee Updated Successfully");
      } else {
        aEmployees.push({
            id: Date.now(),
            name: sName,
            role: sRole
        });
        MessageToast.show("Employee Added Successfully");
      }
      oModel.setProperty("/employees", aEmployees);
      this.getOwnerComponent().updateRoles();
      localStorage.setItem("employees",JSON.stringify(aEmployees));
      oModel.setProperty("/employeeCount",aEmployees.length);
      this.getOwnerComponent().getRouter().navTo("employeeList");
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
  });
});