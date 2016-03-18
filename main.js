/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** TwosCalc Extension 
    author : Gomzion(gomzion@naver.com) / Bobby(shinandmin@naver.com)
    description : Target width ratio calculator
*/
define(function (require, exports, module) {
    'use strict';

    var CommandManager = brackets.getModule('command/CommandManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        Menus = brackets.getModule('command/Menus'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        PanelManager = brackets.getModule("view/PanelManager"),
        AppInit = brackets.getModule("utils/AppInit");
    
    var GZ_COMMAND_ID_W = 'GomzionCalcW.execute';
    var GZ_COMMAND_ID_H = 'GomzionCalcP.execute';
    var GZpanel;
    var GZpanelHtml = require("text!panel.html");
    var GZIcon = $('<a href="#" title="TwosCalc" id="brackets-crosscalc-icon"></a>');

    function calcselectedtext_width() {
        var editor = EditorManager.getCurrentFullEditor(),
            currentSelection,
            originalText,
            processedText;

        // get - selected Text
        if (editor.hasSelection()) {
            var res = 0;
            var tail = "";
            var w = $("#gz-percentage").val();
            currentSelection = editor.getSelection();
            originalText = editor.getSelectedText().trim();

            if (originalText) {
                res = originalText;
                // is string? px / pt
                if (isNaN(res)) {
                    tail = res.substr(-2);
                    if (tail === "px" || tail === "pt") {
                        res = res.substr(0, res.length - 2);
                    }
                }
                // is Number?
                if (!isNaN(res)) {
                    if (w) {
                        res = res * w;
                        res = res.toFixed(4) + tail;
                        editor.document.replaceRange(res.toString(), currentSelection.start, currentSelection.end);
                    } else {
                        alert("(P)Please input Original Width/Target Width");
                        showGZCalcPanel();
                    }
                } else {
                    alert("(P)Possible only [Number] or [px] or [pt]");
                }
            }
        } else {
            alert("(P)Please select the element!");
        }
    }
    
    function calcselectedtext_percent() {
        var editor = EditorManager.getCurrentFullEditor(),
            currentSelection,
            originalText,
            processedText;

        // get - selected Text
        if (editor.hasSelection()) {
            var res = 0;
            var w = $("#gz-origin-width").val();
            currentSelection = editor.getSelection();
            originalText = editor.getSelectedText().trim();

            if (originalText) {
                res = originalText;
                // is string? px / pt
                if (isNaN(res)) {
                    var tail = res.substr(-2);
                    if (tail === "px" || tail === "pt") {
                        res = res.substr(0, res.length - 2);
                    }
                }
                // is Number?
                if (!isNaN(res)) {
                    if (w) {
                        res = res * 100 / w;
                        res = res.toFixed(4) + "%";
                        editor.document.replaceRange(res.toString(), currentSelection.start, currentSelection.end);
                    } else {
                        alert("(%)Please input Original Width!");
                        showGZCalcPanel();
                    }
                } else {
                    alert("(%)Possible only [Number] or [px] or [pt]");
                }
            }
        } else {
            alert("(%)Please select the element!");
        }
    }

    function handleGZCalcPanel() {
        if (GZpanel.isVisible()) {
            GZpanel.hide();
            GZIcon.removeClass('active');
            CommandManager.get(GZ_COMMAND_ID_W).setChecked(false);
        } else {
            GZpanel.show();
            GZIcon.addClass('active');
            CommandManager.get(GZ_COMMAND_ID_W).setChecked(true);
        }
    }
    
    function showGZCalcPanel() {
        if (GZpanel.isVisible()) {
            return;
        }
        
        GZpanel.show();
        GZIcon.addClass('active');
        CommandManager.get(GZ_COMMAND_ID_W).setChecked(true);
    }

    ExtensionUtils.loadStyleSheet(module, "main.css");
    CommandManager.register('TwosCalc(Pixel)', GZ_COMMAND_ID_W, calcselectedtext_width);
    Menus.getMenu(Menus.AppMenuBar.EDIT_MENU).addMenuItem(GZ_COMMAND_ID_W, 'Alt-W');
    
    CommandManager.register('TwosCalc(%)', GZ_COMMAND_ID_H, calcselectedtext_percent);
    Menus.getMenu(Menus.AppMenuBar.EDIT_MENU).addMenuItem(GZ_COMMAND_ID_H, 'Alt-E');

    GZpanel = PanelManager.createBottomPanel(GZ_COMMAND_ID_W, $(GZpanelHtml), 200);
    
    AppInit.appReady(function () {
        /*Events*/
        GZIcon.click(function () {
            handleGZCalcPanel();
        }).appendTo("#main-toolbar .buttons");

        $("#gz-mainpanel")
            .on('click', '.close', function () {
                handleGZCalcPanel();
            });
        
        $("#gz-contents input").on('input', function () //Changes the vh whenever someone types in one of the inputs
            {
                var ow = $("#gz-origin-width").val();
                var tw = $("#gz-target-width").val();
            
                if (!ow) {
                    return;
                }
                if (!tw) {
                    tw = 0;
                }
            
                $("#gz-percentage").val(
                    parseFloat(tw / ow).toFixed(4)
                );
            });
    });
});