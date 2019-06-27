/*
* @Author: nikolius
* @Date:   2018-04-27 09:54:52
* @Last Modified by:   Nikolius Lau
* @Last Modified time: 2018-09-03 16:06:22
*/

/*
    Param2 yg diperlukan ketika load View ini
    1. opsiDisplay
    2. viewVar
*/

Ext.define('Koltiva.view.Farmer.MainForm' ,{
    extend: 'Ext.panel.Panel',
    id: 'Koltiva.view.Farmer.MainForm',
    style:'padding:0 15px 15px 15px;margin:12px 0 0 0;',
    opsiDisplay: false,
    setOpsiDisplay: function(value){
        this.opsiDisplay = value;
    },
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    renderTo: 'ext-content',
    PrintProfile: function(FarmerID){
        preview_cetak_surat(m_farmer_profile + 'CpgID/' + '0' + '/FarmerID/' + FarmerID);
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //Div nya Filter Region
            document.getElementById('divCommonContentRegion').style.display = 'none';
            document.getElementById('main-breadcrumb').style.display = 'none';

        	if(thisObj.viewVar.opsiDisplay == 'insert'){
        		//form reset
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData').getForm().reset();
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Photo').update('<img src="'+m_api_base_url+'/assets/images/farmer-default.png" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFile').update('<img src="'+m_api_base_url+'/assets/images/ktp-default.png" style="height:175px;margin:0px;float:right;" />');

                //Disable Tab
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabFamily').setDisabled(true);
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabLabour').setDisabled(true);
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-TabContract').setDisabled(true);

                thisObj.ObjPanelOtherLand.setVisible(false);
                thisObj.ObjPanelSurveyGarden.setVisible(false);
                thisObj.ObjPanelGardenStatus.setVisible(false);

                //Buka/Tutup Panel
                thisObj.ObjPanelSurveyPostHarvest.collapse();
                thisObj.ObjPanelSurveyPpi2010.collapse();
                thisObj.ObjPanelSurveyPpi2012.collapse();
                thisObj.ObjPanelSurveyNutrition.collapse();
                thisObj.ObjPanelSurveyFinance.collapse();
                thisObj.ObjPanelSurveyEnvironment.collapse();
                thisObj.ObjPanelSurveyAO.collapse();
                thisObj.ObjPanelSurveySocial.collapse();
                thisObj.ObjPanelSurveyFCP.collapse();
                thisObj.ObjPanelSurveySNA.collapse();

                //Farmer Type
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmertypeID').setReadOnly(false);
        	}

        	if(thisObj.viewVar.opsiDisplay == 'view' || thisObj.viewVar.opsiDisplay == 'update'){
        		//Set ReadOnly
        		Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').setReadOnly(true);
        		Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Province').setReadOnly(true);
        		Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-District').setReadOnly(true);

                thisObj.ObjPanelOtherLand.setVisible(true);
                thisObj.ObjPanelSurveyGarden.setVisible(true);
                thisObj.ObjPanelGardenStatus.setVisible(true);

        		if(thisObj.viewVar.opsiDisplay == 'view'){
        			Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BtnSave').setVisible(false);
        			Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-PhotoInput').setVisible(false);
        			Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFileInput').setVisible(false);
        		}

        		//form reset
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData').getForm().reset();
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Photo').update('<img src="'+m_api_base_url+'/assets/images/farmer-default.png" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFile').update('<img src="'+m_api_base_url+'/assets/images/ktp-default.png" style="height:175px;margin:0px;float:right;" />');
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-HavingBankAccNo').setValue(true);

                //load data form
                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/farmers/farmer_basic_data_form',
                    method: 'GET',
                    params: {
                        FarmerID: this.viewVar.FarmerID
                    },
                    success: function(form, action) {
                        Ext.MessageBox.hide();
                        var r = Ext.decode(action.response.responseText);

                        //untuk handle combo bertingkat
                        var cmb_province = Ext.data.StoreManager.lookup('Koltiva.store.ComboGeneral.CmbProvinceAccess');
                        var cmb_district = Ext.data.StoreManager.lookup('Koltiva.store.ComboGeneral.CmbDistrictAccess');
                        var cmb_subdistrict = Ext.data.StoreManager.lookup('Koltiva.store.ComboGeneral.CmbSubDistrictAccess');
                        var cmb_village = Ext.data.StoreManager.lookup('Koltiva.store.ComboGeneral.CmbVillageAccess');
                        var cmb_farmer_group = Ext.data.StoreManager.lookup('Koltiva.store.ComboGeneral.CmbFarmerGroupByDistrict');

                        cmb_province.load({
                            callback: function(records, operation, success){
                                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Province').setValue(r.data.Province);
                                if (success == true) {
                                    cmb_district.load({
                                        params: {
                                            ProvinceID: r.data.Province
                                        },
                                        callback: function(records, operation, success){
                                            if (success == true) {
                                                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-District').setValue(r.data.District);
                                                cmb_subdistrict.load({
                                                    params: {
                                                        DistrictID: r.data.District
                                                    },
                                                    callback: function(records, operation, success){

                                                        //load combo farmer group lagi aja disini dan set nilainya jika ada
                                                        cmb_farmer_group.setStoreVar({DistrictID:r.data.District});
                                                        cmb_farmer_group.load({
                                                            callback: function(records, operation, success){
                                                                if (success == true) {
                                                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-CPGid').setValue(r.data.CPGid);
                                                                }
                                                            }
                                                        });

                                                        if (success == true) {
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SubDistrict').setValue(r.data.SubDistrict);
                                                            cmb_village.load({
                                                                params: {
                                                                    SubDistrictID: r.data.SubDistrict
                                                                },
                                                                callback: function(records, operation, success){
                                                                    if (success == true) {
                                                                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Village').setValue(r.data.Village);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });

                        //set photo
                        if(r.data.Photo != ""){
                            var fotoFarmer = m_api_base_url + '/images/Photo/'+ r.data.Photo;
                            var angkaRand = Math.floor((Math.random() * 100) + 1);
                            checkImageExistsGeneral(fotoFarmer, function(existsImage) {
                                if (existsImage == true) {
                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Photo').update('<a href="'+fotoFarmer+'?'+angkaRand+'" data-lightbox="image-1" data-title="Farmer Photo" title="View Photo"><img src="'+fotoFarmer+'?'+angkaRand+'" style="height:150px;margin:0px 5px 5px 0px;float:left;" /></a>');
                                } else {
                                	Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Photo').update('<img src="'+m_api_base_url+'/assets/images/farmer-default.png" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
                                }
                            });
                        }

                        //set id file
                        if(r.data.IdFile != ""){
                            var fotoId = m_api_base_url + '/'+ r.data.IdFile;
                            var angkaRand = Math.floor((Math.random() * 100) + 1);
                            checkImageExistsGeneral(fotoId, function(existsImage) {
                                if (existsImage == true) {
                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFile').update('<a href="'+fotoId+'?'+angkaRand+'" data-lightbox="image-2" data-title="ID Card" title="View ID Card"><img src="'+fotoId+'?'+angkaRand+'" style="height:175px;margin:0px;float:right;" /></a>');
                                } else {
                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFile').update('<img src="'+m_api_base_url+'/assets/images/ktp-default.png" style="height:175px;margin:0px;float:right;" />');
                                }
                            });
                        }

                        //set LearningContractFile
                        if(r.data.LearningContractFile != "" && r.data.LearningContractFile != null){
                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractUrl').update('<a style="text-decoration:underline;" href="'+m_api_base_url+'/files/learning_contract/'+r.data.LearningContractFile+'" target="_blank">'+lang('View Learning Contract File')+'</a>');
                        }

                        //set CertContractFile
                        /*if(r.data.CertContractFile != "" && r.data.CertContractFile != null){
                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-CertContractUrl').update('<a style="text-decoration:underline;" href="'+m_api_base_url+'/files/certification_contract/'+r.data.CertContractFile+'" target="_blank">'+lang('View Certification Contract File')+'</a>');
                        }*/

                        //set ConsentLetFile
                        if(r.data.ConsentLetFile != "" && r.data.ConsentLetFile != null){
                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetUrl').update('<a style="text-decoration:underline;" href="'+m_api_base_url+'/files/consent_letter/'+r.data.ConsentLetFile+'" target="_blank">'+lang('View Consent Letter File')+'</a>');
                        }

                        //Set Title
                        Ext.getCmp('Koltiva.view.Grower.FormMainGrower-labelInfoInsert').update('<div id="header_title_farmer">'+Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue()+' - <strong>'+Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerName').getValue()+'</strong></div>');
                        Ext.getCmp('Koltiva.view.Grower.FormMainGrower-labelInfoInsert').doLayout();

                        //Buka/Tutup Panel
                        thisObj.ObjPanelSurveyPostHarvest.collapse();
                        thisObj.ObjPanelSurveyPpi2010.collapse();
                        thisObj.ObjPanelSurveyPpi2012.collapse();
                        thisObj.ObjPanelSurveyNutrition.collapse();
                        thisObj.ObjPanelSurveyFinance.collapse();
                        thisObj.ObjPanelSurveyEnvironment.collapse();
                        thisObj.ObjPanelSurveyAO.collapse();
                        thisObj.ObjPanelSurveySocial.collapse();
                        thisObj.ObjPanelSurveyFCP.collapse();
                        thisObj.ObjPanelSurveySNA.collapse();
                        lang(' dalam cihuy')+lang('satu baris coy ')+lang('hahaha kocak')+'textksapalah'
                    },
                    failure: function(form, action) {
                        Ext.MessageBox.hide();
                        Ext.MessageBox.show({
                            title: 'Failed',
                            msg: 'Failed to retrieve data',
                            buttons: Ext.MessageBox.OK,
                            animateTarget: 'mb9',
                            icon: 'ext-mb-error'
                        });
                    }
                });

            }
            
            //Pengaturan Form Basic Farmer based on Partner yang Login (Begin)
            if(m_user_role == 'Program' || m_user_role == 'Private'){
                switch(m_user_partnerid){
                    case '8':
                        //Partner CARGILL!!
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SectionGeneralData-Right').setVisible(false);
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SectionGeneralData-Left').columnWidth = 1;
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SectionGeneralData-Left').doLayout();
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SectionBankInfo').setVisible(false);
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Birthdate').setVisible(false);

                        //Buat sepert view karena ada beberapa form yg mandatory sedangkan tidak bisa dilihat oleh CARGILL
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BtnSave').setVisible(false);
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-PhotoInput').setVisible(false);
                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFileInput').setVisible(false);
                    break;
                }
            }
            //Pengaturan Form Basic Farmer based on Partner yang Login (End)
        },
        beforerender: function(){
            var thisObj = this;
            
            if(thisObj.viewVar.opsiDisplay != 'insert'){
                Ext.MessageBox.show({
                    msg: 'Please wait...',
                    progressText: 'Loading...',
                    width: 300,
                    wait: true,
                    waitConfig: {
                        interval: 200
                    },
                    icon: 'ext-mb-info', //custom class in msg-box.html
                    animateTarget: 'mb9'
                });
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

        //Store yg dipakai =============================================================== (Begin)
        var cmb_province = Ext.create('Koltiva.store.ComboGeneral.CmbProvinceAccess');
        var cmb_district = Ext.create('Koltiva.store.ComboGeneral.CmbDistrictAccess');
        var cmb_subdistrict = Ext.create('Koltiva.store.ComboGeneral.CmbSubDistrictAccess');
        var cmb_village = Ext.create('Koltiva.store.ComboGeneral.CmbVillageAccess');
        var cmb_farmer_group = Ext.create('Koltiva.store.ComboGeneral.CmbFarmerGroupByDistrict');
        var cmb_marital_status = Ext.create('Koltiva.store.ComboGeneral.CmbMaritalStatus');
        var cmb_education = Ext.create('Koltiva.store.ComboGeneral.CmbEducation');
        var cmb_handphone_type = Ext.create('Koltiva.store.ComboGeneral.CmbHandphoneType');
        var cmb_inactive_reason = Ext.create('Koltiva.store.ComboGeneral.CmbFarmerInactiveReason');
        var cmb_bank = Ext.create('Koltiva.store.ComboGeneral.CmbBank');
        var cmb_idtype = Ext.create('Koltiva.store.ComboGeneral.CmbIdType');
        var CmbFarmerType = Ext.create('Koltiva.store.ComboGeneral.CmbFarmerType');
        //Store yg dipakai =============================================================== (End)

        thisObj.ObjPanelFamily = Ext.create('Koltiva.view.Farmer.FamilyLabourGrid', {
        	viewVar: {
                FarmerID: thisObj.viewVar.FarmerID,
                Type: 'Family'
            }
        });

        thisObj.ObjPanelLabour = Ext.create('Koltiva.view.Farmer.FamilyLabourGrid', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID,
                Type: 'Labour'
            }
        });

        thisObj.ObjPanelContractGridCertificationContract = Ext.create('Koltiva.view.Farmer.GridCertificationContract');
        //thisObj.ObjPanelSalesVerificationCertGrid = Ext.create('Koltiva.view.Farmer.GridSalesVerificationCert');
        //thisObj.ObjPanelSalesVerificationNonCertGrid = Ext.create('Koltiva.view.Farmer.GridSalesVerificationNonCert');
        thisObj.ObjPanelSalesVerificationCertGrid = [];
        thisObj.ObjPanelSalesVerificationNonCertGrid = [];

        thisObj.ObjPanelOtherLand = Ext.create('Koltiva.view.Farmer.PanelOtherLand', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });

        thisObj.ObjPanelGardenStatus = Ext.create('Koltiva.view.Farmer.PanelGardenStatus', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.form.Panel',{
            title: lang('Basic Data'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'Koltiva.view.Farmer.MainForm-FormBasicData',
            fileUpload: true,
            collapsible:true,
		    buttonAlign : 'center',
            items: [{
                layout: 'column',
                border: false,
                padding:10,
                items:[{
                    columnWidth: 1,
                    layout:'form',
                    cls: 'Sfr_PanelLayoutFormContainer',
                    items:[{
                        xtype: 'tabpanel',
                        flex: 1,
                        activeTab: 0,
                        plain: true,
                        cls:'Sfr_TabForm',
                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Tab',
                        items:[{
                            xtype: 'panel',
                            title: lang('Farmer Data'),
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabFarmerData',
                            cls: 'Sfr_PanelSubLayoutForm',
                            items:[{
                                xtype:'panel',
                                title: lang('Farmer Profile'),
                                frame: false,
                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionFarmerProfile',
                                style:'margin-top:12px;',
                                cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                items:[{
                                    layout: 'column',
                                    border: false,
                                    items:[{
                                        columnWidth: 0.3,
                                        layout:'form',
                                        style:'padding:10px 0px 10px 5px;',
                                        items:[{
                                            xtype:'panel',
                                            id:'Koltiva.view.Farmer.MainForm-FormBasicData-Photo',
                                            html:'<img src="'+m_api_base_url+'/assets/images/farmer-default.png" style="height:150px;margin:0px 5px 5px 0px;float:left;" />'
                                        },{
                                            xtype: 'fileuploadfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-PhotoInput',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-PhotoInput',
                                            buttonText: 'Browse',
                                            cls: 'Sfr_FormBrowseBtn',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/farmers/photo_farmer',
                                                        clientValidation: false,
                                                        params: {
                                                            opsiDisplay: thisObj.viewVar.opsiDisplay,
                                                            FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue(),
                                                            ProvinceID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Province').getValue()
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Photo').update('<img src="'+m_api_base_url + '/images/Photo/' + o.result.file+'" style="height:150px;margin:0px 5px 5px 0px;float:left;" />');
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-PhotoOld').setValue(o.result.photoInput);
                                                        },
                                                        failure: function(fp, o){
                                                            Ext.MessageBox.show({
                                                                title: lang('Information'),
                                                                msg: lang('Upload process failed, please upload a image file'),
                                                                buttons: Ext.MessageBox.OK,
                                                                animateTarget: 'mb9',
                                                                icon: 'ext-mb-error'
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        },{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-PhotoOld',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-PhotoOld',
                                            inputType: 'hidden'
                                        }]
                                    },{
                                        columnWidth: 0.7,
                                        layout:'form',
                                        style:'padding:10px 5px 10px 20px;',
                                        defaults: {
                                            labelAlign: 'left',
                                            labelWidth: 150
                                        },
                                        items:[{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-FarmerName',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-FarmerName',
                                            fieldLabel: lang('Name'),
                                            allowBlank: false,
                                            baseCls: 'Sfr_FormInputMandatory'
                                        },{
                                            xtype: 'radiogroup',
                                            fieldLabel: lang('Gender'),
                                            allowBlank: false,
                                            baseCls: 'Sfr_FormInputMandatory',
                                            msgTarget: 'side',
                                            columns: 2,
                                            items:[{
                                                boxLabel: lang('Male'),
                                                name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Gender',
                                                inputValue: '1',
                                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Gender1',
                                                listeners:{
                                                    change: function(){
                                                        return false;
                                                    }
                                                }
                                            },{
                                                boxLabel: lang('Female'),
                                                name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Gender',
                                                inputValue: '2',
                                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Gender2',
                                                listeners:{
                                                    change: function(){
                                                        return false;
                                                    }
                                                }
                                            }]
                                        },{
                                            xtype: 'datefield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-DateCollection',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-DateCollection',
                                            fieldLabel: lang('Interview Date'),
                                            allowBlank: false,
                                            baseCls: 'Sfr_FormInputMandatory',
                                            format: 'Y-m-d H:i:s'
                                        },{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID',
                                            fieldLabel: lang('Farmer ID'),
                                            allowBlank: false,
                                            baseCls: 'Sfr_FormInputMandatory'
                                        },{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-OldFarmerID',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-OldFarmerID',
                                            fieldLabel: lang('Prev Farmer ID')
                                        },{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-ExtFarmerID',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-ExtFarmerID',
                                            fieldLabel: lang('External Farmer ID')
                                        },{
                                            xtype: 'combobox',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-FarmertypeID',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-FarmertypeID',
                                            store: CmbFarmerType,
                                            fieldLabel: lang('Farmer Type'),
                                            queryMode: 'local',
                                            displayField: 'label',
                                            valueField: 'id',
                                            readOnly: true,
                                            allowBlank: false,
                                            baseCls: 'Sfr_FormInputMandatory'
                                        },{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-FirstBatchNr',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-FirstBatchNr',
                                            fieldLabel: lang('First Training Batch Nr'),
                                            readOnly: true
                                        }]
                                    }]
                                }]
                            },{
                                xtype:'panel',
                                title: lang('General Data'),
                                frame: false,
                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionGeneralData',
                                style:'margin-top:12px;',
                                cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                items:[{
                                    layout: 'column',
                                    border: false,
                                    items:[{
                                        columnWidth: 0.5,
                                        layout:'form',
                                        style:'padding:10px 0px 10px 5px;',
                                        id:'Koltiva.view.Farmer.MainForm-FormBasicData-SectionGeneralData-Left',
                                        defaults: {
                                            labelAlign: 'top'
                                        },
                                        items:[{
                                            xtype: 'datefield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Birthdate',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Birthdate',
                                            fieldLabel: lang('Birthdate'),
                                            allowBlank: false,
                                            baseCls: 'Sfr_FormInputMandatory',
                                            format: 'Y-m-d',
                                            listeners: {
                                                change: function(cb, nv, ov) {
                                                    var TglNya = Ext.Date.format(nv, 'Y-m-d');
                                                    var today = new Date();
                                                    var birthDate = new Date(TglNya);
                                                    var age = today.getFullYear() - birthDate.getFullYear();
                                                    var m = today.getMonth() - birthDate.getMonth();
                                                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                        age--;
                                                    }

                                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Age').setValue(age);
                                                }
                                            }
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'numberfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Age',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Age',
                                            fieldLabel: lang('Age'),
                                            readOnly: true
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'combobox',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-MaritalStatus',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-MaritalStatus',
                                            store: cmb_marital_status,
                                            fieldLabel: lang('Marital Status'),
                                            queryMode: 'local',
                                            displayField: 'label',
                                            valueField: 'id'
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'combobox',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Education',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Education',
                                            store: cmb_education,
                                            fieldLabel: lang('Education'),
                                            queryMode: 'local',
                                            displayField: 'label',
                                            valueField: 'id'
                                        }]
                                    },{
                                        columnWidth: 0.5,
                                        layout:'form',
                                        style:'padding:10px 5px 10px 20px;',
                                        id:'Koltiva.view.Farmer.MainForm-FormBasicData-SectionGeneralData-Right',
                                        defaults: {
                                            labelAlign: 'top'
                                        },
                                        items:[{
                                            xtype: 'combobox',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdType',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdType',
                                            store: cmb_idtype,
                                            fieldLabel: lang('ID Type'),
                                            queryMode: 'local',
                                            displayField: 'label',
                                            valueField: 'id',
                                            allowBlank: false
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdNo',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdNo',
                                            fieldLabel: lang('ID Number'),
                                            allowBlank: false
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype:'panel',
                                            id:'Koltiva.view.Farmer.MainForm-FormBasicData-IdFile',
                                            html:'<img src="'+m_api_base_url+'/assets/images/ktp-default.png" style="height:175px;margin:0px;float:right;" />'
                                        },{html:'<div style="height:18px;">&nbsp;</div>'},{
                                            xtype: 'fileuploadfield',
                                            fieldLabel: lang('ID File'),
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdFileInput',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdFileInput',
                                            baseCls: 'Sfr_FormBrowseBtn',
                                            buttonText: 'Browse',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/farmers/photo_ktp_farmer',
                                                        clientValidation: false,
                                                        params: {
                                                            opsiDisplay: thisObj.viewVar.opsiDisplay,
                                                            FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue(),
                                                            ProvinceID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Province').getValue()
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFile').update('<img src="'+m_api_base_url + '/' + o.result.file+'" style="height:175px;margin:0px;float:right;" />');
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-IdFileOld').setValue(o.result.IdFileInput);
                                                        },
                                                        failure: function(fp, o){
                                                            Ext.MessageBox.show({
                                                                title: lang('Information'),
                                                                msg: lang('Upload process failed, please upload a image file'),
                                                                buttons: Ext.MessageBox.OK,
                                                                animateTarget: 'mb9',
                                                                icon: 'ext-mb-error'
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        },{
                                            xtype: 'textfield',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdFileOld',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-IdFileOld',
                                            inputType: 'hidden'
                                        }]
                                    }]
                                }]
                            },{
                                layout: 'column',
                                border: false,
                                items:[{
                                    columnWidth: 0.5,
                                    layout:'form',
                                    style:'padding:10px 0px 10px 5px;',
                                    items:[{
                                        xtype:'panel',
                                        title: lang('Addresss and Location'),
                                        frame: false,
                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionAddLocation',
                                        style:'margin-top:12px;',
                                        cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                        items:[{
                                            layout: 'column',
                                            border: false,
                                            items:[{
                                                columnWidth: 1,
                                                layout:'form',
                                                style:'padding:10px 0px 0px 0px;',
                                                defaults: {
                                                    labelAlign: 'top'
                                                },
                                                items:[{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Province',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Province',
                                                    store: cmb_province,
                                                    fieldLabel: lang('Province'),
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            cmb_district.load({
                                                                params: {
                                                                    ProvinceID: nv
                                                                }
                                                            });
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-District').setValue('');
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SubDistrict').setValue('');
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Village').setValue('');
                                                        }
                                                    }
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-District',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-District',
                                                    store: cmb_district,
                                                    fieldLabel: lang('District'),
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            cmb_subdistrict.load({
                                                                params: {
                                                                    DistrictID: nv
                                                                }
                                                            });
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-SubDistrict').setValue('');
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Village').setValue('');
            
                                                            //load store
                                                            cmb_farmer_group.setStoreVar({DistrictID:nv});
                                                            cmb_farmer_group.load();
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-CPGid').setValue('');
                                                        }
                                                    }
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SubDistrict',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-SubDistrict',
                                                    store: cmb_subdistrict,
                                                    fieldLabel: lang('SubDistrict'),
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            cmb_village.load({
                                                                params: {
                                                                    SubDistrictID: nv
                                                                }
                                                            });
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Village').setValue('');
                                                        }
                                                    }
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Village',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Village',
                                                    store: cmb_village,
                                                    fieldLabel: lang('Village'),
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    allowBlank: false,
                                                    baseCls: 'Sfr_FormInputMandatory'
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'textarea',
                                                    fieldLabel: lang('Address'),
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Address',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Address',
                                                    height: 65
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'textfield',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-RtRw',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-RtRw',
                                                    fieldLabel: lang('RT / RW')
                                                }]
                                            }]
                                        }]
                                    },{
                                        xtype:'panel',
                                        title: lang('Garden Information'),
                                        frame: false,
                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionGardenInformation',
                                        style:'margin-top:12px;',
                                        cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                        items:[{
                                            layout: 'column',
                                            border: false,
                                            items:[{
                                                columnWidth: 1,
                                                layout:'form',
                                                style:'padding:10px 0px 0px 0px;',
                                                defaults: {
                                                    labelAlign: 'top'
                                                },
                                                items:[{
                                                    xtype: 'numericfield',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-NrOfCocoaFarmsSelfReport',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-NrOfCocoaFarmsSelfReport',
                                                    fieldLabel: lang('Number of cocoa farms'),
                                                    allowNegative: false,
                                                    minValue: 1,
                                                    maxValue: 20
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'numericfield',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-NrOfCocoaFarms',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-NrOfCocoaFarms',
                                                    readOnly: true,
                                                    allowNegative: false,
                                                    minValue: 0,
                                                    maxValue: 20,
                                                    fieldLabel: lang('Number of surveyed cocoa farms')
                                                }]
                                            }]
                                        }]
                                    }]
                                },{
                                    columnWidth: 0.5,
                                    layout:'form',
                                    style:'padding:10px 5px 10px 20px;',
                                    items:[{
                                        xtype:'panel',
                                        title: lang('Communication'),
                                        frame: false,
                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionCommunication',
                                        style:'margin-top:12px;',
                                        cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                        items:[{
                                            layout: 'column',
                                            border: false,
                                            items:[{
                                                columnWidth: 1,
                                                layout:'form',
                                                style:'padding:10px 0px 0px 0px;',
                                                defaults: {
                                                    labelAlign: 'top'
                                                },
                                                items:[{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-HandphoneType',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-HandphoneType',
                                                    store: cmb_handphone_type,
                                                    fieldLabel: lang('Handphone Type'),
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    listeners: {
                                                        change: function(cb, nv, ov) {
                                                            if(nv == '3'){
                                                                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Handphone').setDisabled(true);
                                                            }else{
                                                                Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-Handphone').setDisabled(false);
                                                            }
                                                        }
                                                    }
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'textfield',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Handphone',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Handphone',
                                                    fieldLabel: lang('Handphone')
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    fieldLabel: lang('Access to Smartphone'),
                                                    xtype: 'radiogroup',
                                                    msgTarget: 'side',
                                                    columns: 2,
                                                    items:[{
                                                        boxLabel: lang('Yes'),
                                                        name: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccessToSmartPhone',
                                                        inputValue: '1',
                                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccessToSmartPhone1',
                                                        listeners:{
                                                            change: function(){
                                                                return false;
                                                            }
                                                        }
                                                    },{
                                                        boxLabel: lang('No'),
                                                        name: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccessToSmartPhone',
                                                        inputValue: '2',
                                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccessToSmartPhone2',
                                                        listeners:{
                                                            change: function(){
                                                                return false;
                                                            }
                                                        }
                                                    }]
                                                }]
                                            }]
                                        }]
                                    },{
                                        xtype:'panel',
                                        title: lang('Farmer Group'),
                                        frame: false,
                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionFarmerGroup',
                                        style:'margin-top:12px;',
                                        cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                        items:[{
                                            layout: 'column',
                                            border: false,
                                            items:[{
                                                columnWidth: 1,
                                                layout:'form',
                                                style:'padding:10px 0px 0px 0px;',
                                                defaults: {
                                                    labelAlign: 'top'
                                                },
                                                items:[{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-CPGid',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-CPGid',
                                                    store: cmb_farmer_group,
                                                    fieldLabel: lang('Farmer Group'),
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    allowBlank: false,
                                                    baseCls: 'Sfr_FormInputMandatory'
                                                }]
                                            }]
                                        }]
                                    },{
                                        xtype:'panel',
                                        title: lang('Farmer Status'),
                                        frame: false,
                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionFarmerStatus',
                                        style:'margin-top:18px;',
                                        cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                        items:[{
                                            layout: 'column',
                                            border: false,
                                            items:[{
                                                columnWidth: 1,
                                                layout:'form',
                                                style:'padding:10px 0px 0px 0px;',
                                                defaults: {
                                                    labelAlign: 'top'
                                                },
                                                items:[{
                                                    fieldLabel: lang('Active Status'),
                                                    xtype: 'radiogroup',
                                                    allowBlank: false,
                                                    baseCls: 'Sfr_FormInputMandatory',
                                                    msgTarget: 'side',
                                                    columns: 2,
                                                    items:[{
                                                        boxLabel: lang('Active'),
                                                        name: 'Koltiva.view.Farmer.MainForm-FormBasicData-StatusFarmer',
                                                        inputValue: '1',
                                                        checked:true,
                                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-StatusFarmer1',
                                                        listeners:{
                                                            change: function(){
                                                                if(this.checked == true){
                                                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-ReasonStatusFarmer').setDisabled(true);
                                                                }else{
                                                                    Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-ReasonStatusFarmer').setDisabled(false);
                                                                }
                                                                return false;
                                                            }
                                                        }
                                                    },{
                                                        boxLabel: lang('Inactive'),
                                                        name: 'Koltiva.view.Farmer.MainForm-FormBasicData-StatusFarmer',
                                                        inputValue: '2',
                                                        id: 'Koltiva.view.Farmer.MainForm-FormBasicData-StatusFarmer2',
                                                        listeners:{
                                                            change: function(){
                                                                return false;
                                                            }
                                                        }
                                                    }]
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'combobox',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-ReasonStatusFarmer',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-ReasonStatusFarmer',
                                                    store: cmb_inactive_reason,
                                                    fieldLabel: lang('Inactive Reason'),
                                                    allowBlank: false,
                                                    queryMode: 'local',
                                                    displayField: 'label',
                                                    valueField: 'id',
                                                    disabled:true
                                                },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                                    xtype: 'textareafield',
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-Comment',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-Comment',
                                                    fieldLabel: lang('Comment')
                                                }]
                                            }]
                                        }]
                                    }]
                                }]
                            },{
                                xtype:'panel',
                                title: lang('Bank Information'),
                                frame: false,
                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-SectionBankInfo',
                                style:'margin-top:12px;',
                                cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                                items:[{
                                    layout: 'column',
                                    border: false,
                                    items:[{
                                        columnWidth: 1,
                                        layout:'form',
                                        style:'padding:10px 0px 0px 0px;',
                                        defaults: {
                                            labelAlign: 'top'
                                        },
                                        items:[{
                                            fieldLabel: lang('Bank Account in the Family to receive payments for sales and premiums'),
                                            labelWidth: 150,
                                            xtype: 'radiogroup',
                                            columns: 2,
                                            allowBlank: false,
                                            items:[{
                                                boxLabel: lang('Yes'),
                                                name: 'Koltiva.view.Farmer.MainForm-FormBasicData-HavingBankAcc',
                                                inputValue: '1',
                                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-HavingBankAccYes',
                                                listeners:{
                                                    change: function(){
                                                        return false;
                                                    }
                                                }
                                            },{
                                                boxLabel: lang('No'),
                                                name: 'Koltiva.view.Farmer.MainForm-FormBasicData-HavingBankAcc',
                                                inputValue: '2',
                                                id: 'Koltiva.view.Farmer.MainForm-FormBasicData-HavingBankAccNo',
                                                listeners:{
                                                    change: function(){
                                                        if(this.checked == true){
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiary').setDisabled(true);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BankName').setDisabled(true);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BankBranch').setDisabled(true);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-AccountNumber').setDisabled(true);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BankClientID').setDisabled(true);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiaryRelation').setDisabled(true);
                                                        }else{
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiary').setDisabled(false);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BankName').setDisabled(false);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BankBranch').setDisabled(false);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-AccountNumber').setDisabled(false);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-BankClientID').setDisabled(false);
                                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiaryRelation').setDisabled(false);
                                                        }
                                                        return false;
                                                    }
                                                }
                                            }]
                                        }]
                                    }]
                                },{
                                    layout: 'column',
                                    border: false,
                                    items:[{
                                        columnWidth: 0.5,
                                        layout:'form',
                                        style:'padding:10px 0px 10px 5px;',
                                        defaults: {
                                            labelAlign: 'top'
                                        },
                                        items:[{
                                            xtype: 'textfield',
                                            fieldLabel: lang('Bank Account Holder'),
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiary',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiary'
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'combobox',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-BankName',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-BankName',
                                            store: cmb_bank,
                                            fieldLabel: lang('Bank Name'),
                                            queryMode: 'local',
                                            displayField: 'label',
                                            valueField: 'id',
                                            listeners: {
                                                change: function(cb, nv, ov) {
                                                }
                                            }
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'textfield',
                                            fieldLabel: lang('Bank Branch'),
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-BankBranch',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-BankBranch'
                                        }]
                                    },{
                                        columnWidth: 0.5,
                                        layout:'form',
                                        style:'padding:10px 5px 10px 20px;',
                                        defaults: {
                                            labelAlign: 'top'
                                        },
                                        items:[{
                                            xtype: 'textfield',
                                            fieldLabel: lang('Bank Account Number'),
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccountNumber',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccountNumber'
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            xtype: 'textfield',
                                            fieldLabel: lang('Bank Client ID'),
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-BankClientID',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-BankClientID'
                                        },{html:'<div style="height:13px;">&nbsp;</div>'},{
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiaryRelation',
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-AccountBeneficiaryRelation',
                                            xtype: 'combo',
                                            fieldLabel: lang('Account Holder Relation to Farmer'),
                                            store: Ext.create('Ext.data.Store', {
                                                fields: ['id', 'label'],
                                                data: [{
                                                    'id': 'Registered Farmer',
                                                    "label": lang("Registered Farmer")
                                                }, {
                                                    'id': 'Spouse',
                                                    "label": lang("Spouse")
                                                }, {
                                                    'id': 'Children',
                                                    "label": lang("Children")
                                                }, {
                                                    'id': 'Other Household Member',
                                                    "label": lang("Other Household Member")
                                                }, ],
                                            }),
                                            displayField: 'label',
                                            valueField: 'id',
                                            queryMode: 'local'
                                        }]
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Family'),
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabFamily',
                            items:[{
                            	layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout:'form',
                                    style:'padding: 10px 0 0 0',
                                    items:[
                                        thisObj.ObjPanelFamily
                                    ]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Labour'),
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabLabour',
                            items:[{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout:'form',
                                    style:'padding: 10px 0 0 0',
                                    items:[
                                        thisObj.ObjPanelLabour
                                    ]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Type of Contract'),
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabContract',
                            items:[{
                                layout: 'column',
                                border: false,
                                items:[{
                                    columnWidth: 1,
                                    layout:'form',
                                    style:'padding-right:25px;',
                                    items: [{
                                        html:'<div class="subtitleForm">'+lang('Learning Contract')+'</div>',
                                        margin:'-20px 0 0 0',
                                        hidden:true
                                    },{
                                        fieldLabel: lang('Status'),
                                        labelWidth: 225,
                                        xtype: 'radiogroup',
                                        columns: 2,
                                        hidden:true,
                                        items:[{
                                            boxLabel: lang('Agree'),
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractStatus',
                                            inputValue: '1',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractStatus1',
                                            listeners:{
                                                change: function(){
                                                    return false;
                                                }
                                            }
                                        },{
                                            boxLabel: lang('Disagree'),
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractStatus',
                                            inputValue: '2',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractStatus2',
                                            listeners:{
                                                change: function(){
                                                    return false;
                                                }
                                            }
                                        }]
                                    },{
                                        layout: 'column',
                                        hidden:true,
                                        items: [{
                                            columnWidth:'0.8',
                                            items:[{
                                                layout:'form',
                                                items:[{
                                                    xtype: 'fileuploadfield',
                                                    fieldLabel: lang('Learning Contract File'),
                                                    labelWidth: 225,
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractFile',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractFile',
                                                    buttonText: 'Browse',
                                                    listeners: {
                                                        'change': function (fb, v) {
                                                            //Harus sudah dalam posisi Update
                                                            if(Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue() != ""){
                                                                thisObj.ObjPanelBasicData.submit({
                                                                    url: m_api + '/farmers/farmer_learning_contract',
                                                                    clientValidation: false,
                                                                    params: {
                                                                        FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue()
                                                                    },
                                                                    waitMsg: 'Sending Photo...',
                                                                    success: function (fp, o) {
                                                                        var r = Ext.decode(o.response.responseText);
                                                                        var urllearning = 'files/learning_contract/'+r.namafile;

                                                                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractUrl').update('<a style="text-decoration:underline;" href="'+m_api_base_url+urllearning+'" target="_blank">'+lang('View Learning Contract File')+'</a>');

                                                                        Ext.MessageBox.show({
                                                                            title: 'Information',
                                                                            msg: lang('File Uploaded'),
                                                                            buttons: Ext.MessageBox.OK,
                                                                            animateTarget: 'mb9',
                                                                            icon: 'ext-mb-success'
                                                                        });
                                                                    },
                                                                    failure: function (fp, o) {
                                                                        var r = Ext.decode(o.response.responseText);
                                                                        Ext.MessageBox.show({
                                                                            title: 'Failed',
                                                                            msg: r.message,
                                                                            buttons: Ext.MessageBox.OK,
                                                                            animateTarget: 'mb9',
                                                                            icon: 'ext-mb-error'
                                                                        });
                                                                    }
                                                                });
                                                            }else{
                                                                Ext.MessageBox.show({
                                                                    title: 'Attention',
                                                                    msg: lang('Save Farmer Data First!'),
                                                                    buttons: Ext.MessageBox.OK,
                                                                    animateTarget: 'mb9',
                                                                    icon: 'ext-mb-info'
                                                                });
                                                            }
                                                        }
                                                    }
                                                }]
                                            }]
                                        },{
                                            columnWidth:'0.2',
                                            items: [{
                                                xtype: 'button',
                                                margin: '6 0 0 10',
                                                text: lang('Show Template'),
                                                handler: function() {
                                                    var  FarmerID = Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue();
                                                    preview_cetak_surat(m_cetak_learning_contract_template + FarmerID);
                                                }
                                            }]
                                        }]
                                    },{
                                        layout: 'column',
                                        border: false,
                                        hidden:true,
                                        items:[{
                                            columnWidth: 1,
                                            layout:'form',
                                            style:'margin-top:-15px;',
                                            items:[{
                                                id:'Koltiva.view.Farmer.MainForm-FormBasicData-LearningContractUrl',
                                                html:'<a style="text-decoration:underline;" href="#" target="_blank">No File</a>'
                                            }]
                                        }]
                                    },{
                                        html:'<div class="subtitleForm">'+lang('Certification Contract')+'</div>',
                                        margin:'-85px 0 0 0'
                                    },{
                                        xtype: 'panel',
                                        margin:'12px 0 0 0',
                                        items: [thisObj.ObjPanelContractGridCertificationContract]
                                    },{
                                        html:'<div class="subtitleForm">'+lang('Consent Letter')+'</div>',
                                        margin:'15px 0 0 0',
                                        hidden:true
                                    },{
                                        fieldLabel: lang('Status'),
                                        labelWidth: 225,
                                        xtype: 'radiogroup',
                                        columns: 2,
                                        hidden:true,
                                        items:[{
                                            boxLabel: lang('Agree'),
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetStatus',
                                            inputValue: '1',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetStatus1',
                                            listeners:{
                                                change: function(){
                                                    return false;
                                                }
                                            }
                                        },{
                                            boxLabel: lang('Disagree'),
                                            name: 'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetStatus',
                                            inputValue: '2',
                                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetStatus2',
                                            listeners:{
                                                change: function(){
                                                    return false;
                                                }
                                            }
                                        }]
                                    },{
                                        layout: 'column',
                                        hidden:true,
                                        items: [{
                                            columnWidth:'0.8',
                                            items:[{
                                                layout:'form',
                                                items:[{
                                                    xtype: 'fileuploadfield',
                                                    fieldLabel: lang('Consent Letter File'),
                                                    labelWidth: 225,
                                                    id: 'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetFile',
                                                    name: 'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetFile',
                                                    buttonText: 'Browse',
                                                    listeners: {
                                                        'change': function (fb, v) {
                                                            //Harus sudah dalam posisi Update
                                                            if(Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue() != ""){
                                                                thisObj.ObjPanelBasicData.submit({
                                                                    url: m_api + '/farmers/farmer_consent_letter',
                                                                    clientValidation: false,
                                                                    params: {
                                                                        FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue()
                                                                    },
                                                                    waitMsg: 'Sending Photo...',
                                                                    success: function (fp, o) {
                                                                        var r = Ext.decode(o.response.responseText);
                                                                        var urlconsent = 'files/consent_letter/'+r.namafile;

                                                                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetUrl').update('<a style="text-decoration:underline;" href="'+m_api_base_url+urlconsent+'" target="_blank">'+lang('View Consent Letter File')+'</a>');

                                                                        Ext.MessageBox.show({
                                                                            title: 'Information',
                                                                            msg: lang('File Uploaded'),
                                                                            buttons: Ext.MessageBox.OK,
                                                                            animateTarget: 'mb9',
                                                                            icon: 'ext-mb-success'
                                                                        });
                                                                    },
                                                                    failure: function (fp, o) {
                                                                        var r = Ext.decode(o.response.responseText);
                                                                        Ext.MessageBox.show({
                                                                            title: 'Failed',
                                                                            msg: r.message,
                                                                            buttons: Ext.MessageBox.OK,
                                                                            animateTarget: 'mb9',
                                                                            icon: 'ext-mb-error'
                                                                        });
                                                                    }
                                                                });
                                                            }else{
                                                                Ext.MessageBox.show({
                                                                    title: 'Attention',
                                                                    msg: lang('Save Farmer Data First!'),
                                                                    buttons: Ext.MessageBox.OK,
                                                                    animateTarget: 'mb9',
                                                                    icon: 'ext-mb-info'
                                                                });
                                                            }
                                                        }
                                                    }
                                                }]
                                            }]
                                        },{
                                            columnWidth:'0.2',
                                            items: [{
                                                xtype: 'button',
                                                margin: '6 0 0 10',
                                                text: lang('Show Template'),
                                                handler: function() {
                                                    var  FarmerID = Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue();
                                                    preview_cetak_surat(m_cetak_certification_contract_template + FarmerID);
                                                }
                                            }]
                                        }]
                                    },{
                                        layout: 'column',
                                        border: false,
                                        hidden:true,
                                        items:[{
                                            columnWidth: 1,
                                            layout:'form',
                                            style:'margin-top:-15px;',
                                            items:[{
                                                id:'Koltiva.view.Farmer.MainForm-FormBasicData-ConsentLetUrl',
                                                html:'<a style="text-decoration:underline;" href="#" target="_blank">No File</a>'
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }/*,{
                            xtype: 'panel',
                            title: lang('Sales Verification'),
                            hidden:true,
                            id: 'Koltiva.view.Farmer.MainForm-FormBasicData-TabSalesVer',
                            items:[{
                                layout: 'column',
                                border: false,
                                items:[{
                                    columnWidth: 1,
                                    layout:'form',
                                    style:'padding:5px;',
                                    items: [{
                                        xtype: 'panel',
                                        margin:'12px 0 0 0',
                                        items: [thisObj.ObjPanelSalesVerificationCertGrid]
                                    },{
                                        xtype: 'panel',
                                        margin:'12px 0 0 0',
                                        items: [thisObj.ObjPanelSalesVerificationNonCertGrid]
                                    }]
                                }]
                            }]
                        }*/],
                        listeners: {
                            'tabchange': function (tabPanel, tab) {
                                switch(tab.id){
                                    case 'Koltiva.view.Farmer.MainForm-FormBasicData-TabContract':
                                        thisObj.ObjPanelContractGridCertificationContract.store.setStoreVar({FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue()});
                                        thisObj.ObjPanelContractGridCertificationContract.store.load();
                                    break;
                                    /*case 'Koltiva.view.Farmer.MainForm-FormBasicData-TabSalesVer':
                                        thisObj.ObjPanelSalesVerificationCertGrid.store.setStoreVar({
                                            FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue()
                                        });
                                        thisObj.ObjPanelSalesVerificationCertGrid.store.load();

                                        thisObj.ObjPanelSalesVerificationNonCertGrid.store.setStoreVar({FarmerID: Ext.getCmp('Koltiva.view.Farmer.MainForm-FormBasicData-FarmerID').getValue()});
                                        thisObj.ObjPanelSalesVerificationNonCertGrid.store.load();
                                    break;*/
                                }
                            }
                        }
                    }]
                }]
            }],
            buttons: [{
                xtype:'button',
                icon: varjs.config.base_url + 'images/icons/new/printout.png',
                text: lang('Printout Profile'),
                cls:'Sfr_BtnFormGreen',
                overCls:'Sfr_BtnFormGreen-Hover',
                handler: function() {
                    thisObj.PrintProfile(thisObj.viewVar.FarmerID);
                }
            },{
                xtype:'button',
                icon: varjs.config.base_url + 'images/icons/new/save.png',
                text: lang('Save'),
                cls:'Sfr_BtnFormBlue',
                overCls:'Sfr_BtnFormBlue-Hover',
                id:'Koltiva.view.Farmer.MainForm-FormBasicData-BtnSave',
                handler: function() {
                    if (thisObj.ObjPanelBasicData.isValid()) {

                		thisObj.ObjPanelBasicData.submit({
                            url: m_api + '/farmers/farmer',
                            method:'POST',
                            waitMsg: 'Saving data...',
                            params: {
                            	opsiDisplay: thisObj.viewVar.opsiDisplay
                            },
                            success: function(fp, o) {
                                Ext.MessageBox.show({
                                    title: 'Information',
                                    msg: lang('Data saved'),
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-success',
                                    fn : function(btn) {
                                        if(btn=='ok'){
                                            Ext.getCmp('Koltiva.view.Farmer.MainForm').destroy(); //destory current view
                                            var MainForm = [];
                                            if(Ext.getCmp('Koltiva.view.Farmer.MainForm') == undefined){
                                                MainForm = Ext.create('Koltiva.view.Farmer.MainForm', {
                                                    viewVar: {
                                                        opsiDisplay: 'update',
                                                        FarmerID: o.result.MemberIDInc
                                                    }
                                                });
                                            }else{
                                                Ext.getCmp('Koltiva.view.Farmer.MainForm').destroy();
                                                MainForm = Ext.create('Koltiva.view.Farmer.MainForm', {
                                                    viewVar: {
                                                        opsiDisplay: 'update',
                                                        FarmerID: o.result.MemberIDInc
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            },
                            failure: function(fp, o){
                                var pesanNya;
                                if(o.result.message != undefined){
                                    pesanNya = o.result.message;
                                }else{
                                    pesanNya = lang('Connection error');
                                }
                                Ext.MessageBox.show({
                                    title: 'Fail',
                                    msg: pesanNya,
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-error'
                                });
                            }
                        });

                	}else{
                		Ext.MessageBox.show({
                            title: 'Attention',
                            msg: lang('Form not complete yet'),
                            buttons: Ext.MessageBox.OK,
                            animateTarget: 'mb9',
                            icon: 'ext-mb-info'
                        });
                	}
                }
            }]
        });
        //Panel Basic ==================================== (End)

        //Panel Mars Additional ==================================== (Begin)
        var CmbCollector = Ext.create('Koltiva.store.Farmer.CmbCollector');

        var ObjPanelMarsAdditional = [];
        if(m_menu_from == 'farmers_mars') {
            if(thisObj.viewVar.opsiDisplay == 'view' || thisObj.viewVar.opsiDisplay == 'update'){
                ObjPanelMarsAdditional = Ext.create('Ext.form.Panel',{
                    title: lang('Additional Data'),
                    frame: true,
                    cls: 'Sfr_PanelLayoutForm',
                    id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional',
                    style:'margin:0px 0 15px 15px;',
                    collapsible:true,
                    buttonAlign : 'right',
                    fieldDefaults: {
                        labelAlign: 'left',
                        labelWidth: 185
                    },
                    items: [{
                        layout: 'column',
                        border: false,
                        padding:10,
                        items:[{
                            columnWidth: 1,
                            layout:'form',
                            cls: 'Sfr_PanelLayoutFormContainer',
                            items: [{
                                xtype: 'combobox',
                                id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-SupplychainID',
                                name: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-SupplychainID',
                                store: CmbCollector,
                                fieldLabel: lang('Collector'),
                                queryMode: 'local',
                                displayField: 'label',
                                valueField: 'id',
                                listeners: {
                                    change: function(cb, nv, ov) {
                                        var indexTerpilih = this.getStore().findExact('id', nv);
                                        var recordTerpilih = this.getStore().getAt(indexTerpilih);
                                        if(recordTerpilih != undefined){
                                            Ext.getCmp('Koltiva.view.Farmer.MainForm-FormMarsAdditional-HubName').setValue(recordTerpilih.get('hubarea'));
                                        }
                                    }
                                }
                            },{
                                xtype: 'textfield',
                                id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-HubName',
                                name: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-HubName',
                                readOnly: true,
                                fieldLabel: lang('Hub')
                            },{
                                xtype: 'numericfield',
                                id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-SalesQuota',
                                name: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-SalesQuota',
                                fieldLabel: lang('Sales Quota (kg)'),
                                allowNegative: false,
                                minValue: 0
                            },{
                                xtype: 'textfield',
                                id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-FarmerTypeMars',
                                name: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-FarmerTypeMars',
                                readOnly: true,
                                fieldLabel: lang('Farmer Type Mars')
                            },{
                                xtype: 'textfield',
                                id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-StatusSertifikasi',
                                name: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-StatusSertifikasi',
                                readOnly: true,
                                fieldLabel: lang('Status Sertifikasi')
                            },{
                                xtype: 'textfield',
                                id: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-CertificateHolderLabel',
                                name: 'Koltiva.view.Farmer.MainForm-FormMarsAdditional-CertificateHolderLabel',
                                readOnly: true,
                                fieldLabel: lang('Certificate Holder')
                            }]
                        }]
                    }],
                    buttons: [{
                        xtype:'button',
                        icon: varjs.config.base_url + 'images/icons/new/save.png',
                        text: lang('Save'),
                        cls:'Sfr_BtnFormBlue',
                        overCls:'Sfr_BtnFormBlue-Hover',
                        id:'Koltiva.view.Farmer.MainForm-FormMarsAdditional-BtnSave',
                        handler: function() {
                            if (ObjPanelMarsAdditional.isValid()) {

                                ObjPanelMarsAdditional.submit({
                                    url: m_api + '/farmers/farmer_mars_additional',
                                    method:'POST',
                                    waitMsg: 'Saving data...',
                                    params: {
                                        FarmerID: thisObj.viewVar.FarmerID
                                    },
                                    success: function(rp, o){
                                        var r = Ext.decode(o.response.responseText);
                                        Ext.MessageBox.show({
                                            title: 'Information',
                                            msg: r.message,
                                            buttons: Ext.MessageBox.OK,
                                            animateTarget: 'mb9',
                                            icon: 'ext-mb-success'
                                        });
                                    },
                                    failure: function(rp, o){
                                        try {
                                            var r = Ext.decode(o.response.responseText);
                                            Ext.MessageBox.show({
                                                title: 'Error',
                                                msg: r.message,
                                                buttons: Ext.MessageBox.OK,
                                                animateTarget: 'mb9',
                                                icon: 'ext-mb-error'
                                            });
                                        }
                                        catch(err) {
                                            Ext.MessageBox.show({
                                                title: 'Error',
                                                msg: 'Connection Error',
                                                buttons: Ext.MessageBox.OK,
                                                animateTarget: 'mb9',
                                                icon: 'ext-mb-error'
                                            });
                                        }
                                    }
                                });
        
                            }else{
                                Ext.MessageBox.show({
                                    title: 'Attention',
                                    msg: lang('Form not complete yet'),
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-info'
                                });
                            }
                        }
                    }],
                    listeners: {
                        'afterrender': function( thisForm, eOpts ) {
                            //Load form disini
                            thisForm.getForm().reset();
                            
                            thisForm.getForm().load({
                                url: m_api + '/farmers/farmer_additional_mars_data_form',
                                method: 'GET',
                                params: {
                                    FarmerID: thisObj.viewVar.FarmerID
                                },
                                success: function(form, action) {
                                    Ext.MessageBox.hide();
                                    var r = Ext.decode(action.response.responseText);

                                    //View
                                    if(thisObj.viewVar.opsiDisplay == 'view'){
                                        Ext.getCmp('Koltiva.view.Farmer.MainForm-FormMarsAdditional-BtnSave').setVisible(false);
                                    }
                                },
                                failure: function(form, action) {
                                    Ext.MessageBox.hide();
                                    Ext.MessageBox.show({
                                        title: 'Failed',
                                        msg: 'Failed to retrieve data',
                                        buttons: Ext.MessageBox.OK,
                                        animateTarget: 'mb9',
                                        icon: 'ext-mb-error'
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
        //Panel Mars Additional ==================================== (End)

        //Define ObjPanelDinamis
        var ObjPanelDinamisAccessControl = [];
        ObjPanelDinamisAccessControl.push(ObjPanelMarsAdditional);
        ObjPanelDinamisAccessControl.push(thisObj.ObjPanelOtherLand);

        //Panel Dinamis ==================================== (Begin)
        thisObj.ObjPanelSurveyGarden = Ext.create('Koltiva.view.Farmer.PanelSurveyGarden', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_garden == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelGardenStatus);
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyGarden);
        }

        thisObj.ObjPanelSurveyPostHarvest = Ext.create('Koltiva.view.Farmer.PanelSurveyPostHarvest', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_post_harvest == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyPostHarvest);
        }

        thisObj.ObjPanelSurveyPpi2010 = Ext.create('Koltiva.view.Farmer.PanelSurveyPpi2010', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_ppi_2010 == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyPpi2010);
        }

        thisObj.ObjPanelSurveyPpi2012 = Ext.create('Koltiva.view.Farmer.PanelSurveyPpi2012', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_ppi_2012 == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyPpi2012);
        }

        thisObj.ObjPanelSurveyNutrition = Ext.create('Koltiva.view.Farmer.PanelSurveyNutrition', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_nutrition == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyNutrition);
        }

        thisObj.ObjPanelSurveyFinance = Ext.create('Koltiva.view.Farmer.PanelSurveyFinance', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_finance == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyFinance);
        }

        thisObj.ObjPanelSurveyEnvironment = Ext.create('Koltiva.view.Farmer.PanelSurveyEnvironment', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_environment == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyEnvironment);
        }

        thisObj.ObjPanelSurveyAO = Ext.create('Koltiva.view.Farmer.PanelSurveyAO', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_ao == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyAO);
        }

        thisObj.ObjPanelSurveySocial = Ext.create('Koltiva.view.Farmer.PanelSurveySocial', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_social == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveySocial);
        }

        thisObj.ObjPanelSurveyFCP = Ext.create('Koltiva.view.Farmer.PanelSurveyFCP', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_fcp == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveyFCP);
        }

        thisObj.ObjPanelSurveySNA = Ext.create('Koltiva.view.Farmer.PanelSurveySNA', {
            viewVar: {
                FarmerID: thisObj.viewVar.FarmerID
            }
        });
        if(m_act_farmer_survey_sna == false){
            ObjPanelDinamisAccessControl.push(thisObj.ObjPanelSurveySNA);
        }
        //Panel Dinamis ==================================== (End)


        //========================================================== LAYOUT UTAMA (Begin) ========================================//
        thisObj.items = [{
            xtype: 'panel',
            border:false,
            layout:{
                type:'hbox'
            },
            items:[{
                id: 'Koltiva.view.Grower.FormMainGrower-labelInfoInsert',
                html:'<div id="header_title_farmer">'+lang('Farmer Data')+'</div>'
            }]
        },{
            items:[{
                id: 'Koltiva.view.Grower.FormMainGrower-LinkBackToList',
                html:'<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGrid"><ul class="Sft_UlListInfoDataGrid"><li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'Koltiva.view.Farmer.MainForm\').BackToList()"><img class="Sft_ListIconInfoDataGrid" src="'+varjs.config.base_url+'images/icons/new/back.png" width="20" />&nbsp;&nbsp;'+lang('Back to Farmer List')+'</a></li></div>'
            }]
        },{
            html:'<br />'
        },{
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.6,
                items:[
                    thisObj.ObjPanelBasicData
                ]
            },{
                //RIGHT CONTENT
                columnWidth: 0.4,
                items: ObjPanelDinamisAccessControl
                /*items:[
                    thisObj.ObjPanelOtherLand,
                    thisObj.ObjPanelGardenStatus,
                    thisObj.ObjPanelSurveyGarden,
                    thisObj.ObjPanelSurveyPostHarvest,
                    thisObj.ObjPanelSurveyPpi2010,
                    thisObj.ObjPanelSurveyPpi2012,
                    thisObj.ObjPanelSurveyNutrition,
                    thisObj.ObjPanelSurveyFinance,
                    thisObj.ObjPanelSurveyEnvironment,
                    thisObj.ObjPanelSurveyAO,
                    thisObj.ObjPanelSurveySocial,
                    thisObj.ObjPanelSurveyFCP,
                    thisObj.ObjPanelSurveySNA
                ]*/
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function(){
        Ext.getCmp('Koltiva.view.Farmer.MainForm').destroy(); //destory current view
        var GridMainGrower = [];

        if(m_menu_from == 'farmers_mars'){
            if(Ext.getCmp('Koltiva.view.Farmer.MarsMainGrid') == undefined){
                GridMainGrower = Ext.create('Koltiva.view.Farmer.MarsMainGrid');
            }else{
                //destroy, create ulang
                Ext.getCmp('Koltiva.view.Farmer.MarsMainGrid').destroy();
                GridMainGrower = Ext.create('Koltiva.view.Farmer.MarsMainGrid');
            }
        }

        if(m_menu_from == 'farmers'){
            if(Ext.getCmp('Koltiva.view.Farmer.MainGrid') == undefined){
                GridMainGrower = Ext.create('Koltiva.view.Farmer.MainGrid');
            }else{
                //destroy, create ulang
                Ext.getCmp('Koltiva.view.Farmer.MainGrid').destroy();
                GridMainGrower = Ext.create('Koltiva.view.Farmer.MainGrid');
            }
        }
    }
});
