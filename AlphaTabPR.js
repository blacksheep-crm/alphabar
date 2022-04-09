//Regenerate using:https://duncanford.github.io/prpm-code-generator/?prpm=PR&object=DesktopList&name=AlphaTab&userprops=&comments=No&logging=No
if (typeof (SiebelAppFacade.AlphaTabPR) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.AlphaTabPR");
    define("siebel/custom/AlphaTabPR", ["siebel/jqgridrenderer"],
        function () {
            SiebelAppFacade.AlphaTabPR = (function () {

                function AlphaTabPR(pm) {
                    SiebelAppFacade.AlphaTabPR.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(AlphaTabPR, SiebelAppFacade.JQGridRenderer);

                AlphaTabPR.prototype.Init = function () {
                    SiebelAppFacade.AlphaTabPR.superclass.Init.apply(this, arguments);
                }

                AlphaTabPR.prototype.ShowUI = function () {
                    SiebelAppFacade.AlphaTabPR.superclass.ShowUI.apply(this, arguments);
                    try {
                        this.CreateAlphaBar();
                    }
                    catch (e) {
                        console.log("Error in AlphaTabPR:ShowUI: " + e.toString());
                    }
                }

                AlphaTabPR.prototype.BindData = function (bRefresh) {
                    SiebelAppFacade.AlphaTabPR.superclass.BindData.apply(this, arguments);
                }

                AlphaTabPR.prototype.BindEvents = function () {
                    SiebelAppFacade.AlphaTabPR.superclass.BindEvents.apply(this, arguments);
                    try {
                        this.BindAlphaTabEvents();
                    }
                    catch (e) {
                        console.log("Error in AlphaTabPR:BindEvents: " + e.toString());
                    }
                }

                //bind events helper
                AlphaTabPR.prototype.BindAlphaTabEvents = function () {
                    var pm = this.GetPM();
                    var fi = pm.Get("GetFullId");
                    var co = this.GetInlineQueryControls();
                    var qcb = co.qcb;
                    var qcb_elem;
                    if (typeof (qcb) !== "undefined") {
                        //define event handlers on query combo box
                        qcb_elem = this.GetUIWrapper(qcb).GetEl();
                        qcb_elem.on("autocompleteselect", function (event, ui) {
                            if (ui.value != "") {
                                //show alpha bar if a single column is selected
                                $("#bcrm_abar_" + fi).show();
                            }
                        });
                        qcb_elem.on("keyup", function (event, ui) {
                            if ($(this).val() == "") {
                                //hide alpha bar if no column selected
                                $("#bcrm_abar_" + fi).hide();
                            }
                        });

                        //experimental filter
                        var exclude_items = ["Revenue", "Committed", "Team Space", "New"];
                        $(qcb_elem).data('ui-autocomplete')._renderMenu = function (ul, items) {
                            var that = this;
                            $.each(items, function (index, item) {
                                if (exclude_items.indexOf(item.label) == -1) {
                                    that._renderItemData(ul, item);
                                }
                            });
                        };
                    }
                }

                //helper function to get the inline query controls (combo box, search box and button)
                AlphaTabPR.prototype.GetInlineQueryControls = function () {
                    var pm = this.GetPM();
                    var co = {};
                    var cs = pm.Get("GetControls");
                    //different control names for popup list applets, argh
                    if (pm.Get("IsPopup")) {
                        co.qcb = cs["PopupQueryCombobox"];
                        co.qss = cs["PopupQuerySrchspec"];
                    }
                    else {
                        co.qcb = cs["QueryComboBox"];
                        co.qss = cs["QuerySrchSpec"];
                    }
                    co.qex = cs["PopupQueryExecute"];
                    return co;
                }

                AlphaTabPR.prototype.CreateAlphaBar = function () {
                    var co = this.GetInlineQueryControls();
                    //abar can be modified to use different labels and/or use different search specs
                    //e.g. support languages with special chars "Ü:Ü*"
                    //e.g. add a button "Contains black":"*black*"
                    //e.g. case insensitive "A*":"A* OR a*"
                    //with a bit of effort, this can be based on user preferences etc
                    var abar = {
                        A: "A*",
                        B: "B*",
                        C: "C*",
                        D: "D*",
                        E: "E*",
                        F: "F*",
                        G: "G*",
                        H: "H*",
                        I: "I*",
                        J: "J*",
                        K: "K*",
                        L: "L*",
                        M: "M*",
                        N: "N*",
                        O: "O*",
                        P: "P*",
                        Q: "Q*",
                        R: "R*",
                        S: "S*",
                        T: "T*",
                        U: "U*",
                        V: "V*",
                        W: "W*",
                        X: "X*",
                        Y: "Y*",
                        Z: "Z*",
                        "*": "*"
                    }
                    //override example
                    //BONUS POINTS: create getter/setter for abar
                    abar["A"] = "A* OR a*";

                    var pm = this.GetPM();
                    var pr = this;
                    var fi = pm.Get("GetFullId");
                    var qcb = co.qcb;
                    var qss = co.qss;
                    var qcb_elem;
                    var ab;

                    //main container
                    var abar_cont = $("<div id='bcrm_abar_" + fi + "'>");

                    //TODO: move to custom style sheet pronto
                    abar_cont.css({
                        "padding-left": "4px",
                        "padding-bottom": "2px",
                        "display": "none"
                    });

                    if (typeof (qcb) !== "undefined") {
                        qcb_elem = this.GetUIWrapper(qcb).GetEl();
                        qss_elem = this.GetUIWrapper(qss).GetEl();

                        //generate buttons
                        for (a in abar) {
                            ab = $("<button id='bcrm_abar_btn_" + fi + "_" + a + "'>" + a + "</button>");
                            ab.attr("title", abar[a]);

                            //TODO: move to custom style sheet pronto
                            ab.css({
                                "margin": "0px",
                                "cursor": "pointer"
                            });

                            //button event handler
                            ab.on("click", function () {
                                //clear style for all buttons
                                //TODO: replace with real style sheet class and RemoveClass
                                $(this).parent().find("button").css("font-weight", "");
                                $(this).parent().find("button").css("background", "");

                                //get search spec
                                var v = abar[$(this).text()];

                                //set search spec control
                                pr.GetUIWrapper(qss).SetValue(v);

                                //Call Find method
                                //TODO: Find out why we have to call this twice!!!!
                                //Could be replaced with ExecuteQuery but requires more effort
                                pm.ExecuteMethod("InvokeMethod", "Find");
                                pm.ExecuteMethod("InvokeMethod", "Find");

                                //TODO: replace with real style sheet class and AddClass
                                $(this).css("font-weight", "bold");
                                $(this).css("background", "lightblue");
                            });
                            abar_cont.append(ab);
                        }

                        //show alpha tabs after inline query bar
                        //good for wide applets
                        qcb_cont = qcb_elem.parent();
                        if (pm.Get("IsPopup")) {
                            qcb_cont.parent().append(abar_cont);
                        }
                        else {
                            qcb_cont.after(abar_cont);
                        }

                        //Example: show alpha tabs on bottom of list applet (retro)
                        //$("#" + fi).append(abar_cont);

                        //show alpha tabs if column already (pre)selected
                        setTimeout(function () {
                            if (qcb_elem.val() != "") {
                                $("#bcrm_abar_" + fi).show();
                            }
                        }, 100);
                    }
                }

                AlphaTabPR.prototype.EndLife = function () {
                    SiebelAppFacade.AlphaTabPR.superclass.EndLife.apply(this, arguments);
                }

                return AlphaTabPR;
            }()
            );
            return "SiebelAppFacade.AlphaTabPR";
        })
}
