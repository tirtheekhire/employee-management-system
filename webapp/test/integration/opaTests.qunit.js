/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/example/employeeapp/employeeapp/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
