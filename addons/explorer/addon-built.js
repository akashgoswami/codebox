define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!stylesheets/explorer",[],function(){}),define("views/explorer",["less!stylesheets/explorer.less"],function(){var e=codebox.require("underscore"),t=codebox.require("jQuery"),n=codebox.require("hr/hr"),r=codebox.require("utils/uploader"),i=codebox.require("utils/dialogs"),s=codebox.require("views/files/base"),o=s.extend({className:"addon-files-explorer",templateLoader:"addon.explorer.templates",template:"explorer.html",defaults:e.extend({},s.prototype.defaults,{navigate:!0,hiddenFiles:!0}),events:{"click .file":"selectOnlyFile","click .action-open-file":"openFile","click .action-open-parent":"openParent","click .file .select input":"selectFile","change .uploader":"uploadStart","change .uploader-directory":"uploadStart","click .action-file-togglehidden":"toggleHiddenFiles","click .action-file-refresh":"actionRefresh","click .action-file-create":"actionCreate","click .action-file-upload":"actionUpload","click .action-file-upload-directory":"actionUploadDirectory","click .action-file-mkdir":"actionMkdir","click .action-file-rename":"actionRename","click .action-file-delete":"actionDelete","click .action-file-download":"actionDownload"},initialize:function(t){return o.__super__.initialize.apply(this,arguments),this.files=null,this.model.on("set",this.refresh,this),this.selectedFiles=[],this.on("selection:change",function(t){this.$("*[data-filesselection]").toggleClass("disabled",e.size(this.selectedFiles)==0)},this),this.uploader=new r({directory:this.model}),this.uploader.on("state",function(e){self.$(".action-file-upload-select").removeClass("btn-danger"),self.$(".action-file-upload-select .percent").text(e+"%")}),this.uploader.on("error",function(){self.$(".action-file-upload-select").addClass("btn-danger"),self.$(".action-file-upload-select .percent").text("Error!")}),this.uploader.on("end",function(){self.$(".action-file-upload-select").removeClass("btn-danger"),self.$(".action-file-uploadd-select .percent").text("")}),this.refresh(),this},templateContext:function(){return{options:this.options,file:this.model,files:this.files||[],view:this}},render:function(){return this.files==null?this:o.__super__.render.apply(this,arguments)},finish:function(){return this.unselectFiles(),this.$(".file-hidden").toggle(!this.options.hiddenFiles),o.__super__.finish.apply(this,arguments)},getFilesSelection:function(){return e.filter(this.files,function(t){return e.contains(this.selectedFiles,t.path())},this)},toggleHiddenFiles:function(e){return e!=null&&e.preventDefault(),this.options.hiddenFiles=!this.options.hiddenFiles,this.render()},refresh:function(){var e=this;if(this.model.path()==null||!this.model.isDirectory())return;this.model.listdir().then(function(t){e.files=t,e.render()},function(){throw"error when getting sub file"})},actionRefresh:function(e){e.preventDefault(),this.load(this.model.path())},actionCreate:function(e){var t=this;e.preventDefault(),i.prompt("Create a new file","newfile.txt").done(function(e){e.length>0&&t.model.createFile(e)})},actionMkdir:function(e){var t=this;e.preventDefault(),i.prompt("Create a new directory","newdirectory").done(function(e){e.length>0&&t.model.mkdir(e)})},actionRename:function(t){var n,r=this;t.preventDefault(),n=this.getFilesSelection();if(e.size(n)==0)return;i.prompt("Rename",n[0].get("name")).done(function(e){e.length>0&&n[0].rename(e)})},actionDelete:function(t){var n,r=this;t.preventDefault(),n=this.getFilesSelection();if(e.size(n)==0)return;i.confirm("Do your really want to remove these files?").done(function(t){if(t!=1)return;e.each(n,function(e){e.remove()})})},actionDownload:function(t){var n,r=this;t.preventDefault(),n=this.getFilesSelection();if(e.size(n)==0)return;n[0].download({redirect:!0})},actionUpload:function(e){var t=this;e.preventDefault(),this.$(".uploader").trigger("click")},actionUploadDirectory:function(e){var t=this;e.preventDefault(),this.$(".uploader-directory").trigger("click")},uploadStart:function(e){e.preventDefault(),this.uploader.upload(e.currentTarget.files)},selectFile:function(e){e.stopPropagation();var n=t(e.currentTarget).parents(".file");this.toggleFileSelection(n,t(e.currentTarget).is(":checked"))},openFile:function(n){n.preventDefault();var r=t(n.currentTarget).parents(".file"),i=r.data("filepath");if(i==null||i.length==0)return;r=e.find(this.files,function(e){return e.path()==i}),r.open()},openParent:function(e){e.preventDefault(),this.model.open(this.model.parentPath())},selectOnlyFile:function(e){this.unselectFiles();var n=t(e.currentTarget);this.toggleFileSelection(n,!0)},unselectFiles:function(){this.selectedFiles=[],this.$(".file").removeClass("selected"),this.$(".file .select input").prop("checked",!1),this.trigger("selection:change",this.selectedFiles)},toggleFileSelection:function(n,r){var i;n=t(n),i=n.data("filepath");if(i==null||i.length==0)return;n.toggleClass("selected",r),n.find(".select input").prop("checked",r),e.contains(this.selectedFiles,i)&&r==0?this.selectedFiles.splice(this.selectedFiles.indexOf(i),1):r==1&&this.selectedFiles.push(i),this.selectedFiles=e.uniq(this.selectedFiles),this.trigger("selection:change",this.selectedFiles)}});return o}),define("client",["views/explorer"],function(e){var t=codebox.require("core/files");t.addHandler("explorer",{name:"Explorer",View:e,valid:function(e){return e.isDirectory()}})}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}(".addon-files-explorer .files{list-style:none;position:absolute;top:0;bottom:0;left:0;right:0;margin:0;padding:0;overflow-y:auto}.addon-files-explorer .files li.file{padding:6px 8px;border-bottom:1px solid #eee;font-size:14px;background:#fff}.addon-files-explorer .files li.file.level-up{padding-left:78px}.addon-files-explorer .files li.file:nth-child(even){background:#f9f9f9}.addon-files-explorer .files li.file:hover{background:#f5f5f5}.addon-files-explorer .files li.file.selected{background:#FFFFD6!important}.addon-files-explorer .files li.file a{color:inherit}.addon-files-explorer .files li.file a:hover{text-decoration:underline;color:#15C}.addon-files-explorer .files li.file span.select{margin-left:10px;margin-right:20px}.addon-files-explorer .files li.file span.select input{margin:0 0 2px}.addon-files-explorer .files li.file span.icon{font-size:15px;margin-right:6px}.addon-files-explorer .files li.file span.label{float:right;margin-top:2px}.addon-files-explorer .files li.file span.mtime{float:right;margin-left:12px}.addon-files-explorer .files li.file .collaborators{float:right;margin-left:10px}.addon-files-explorer .files li.file .collaborators a{display:inline-block;width:20px;height:20px;margin-right:3px}.addon-files-explorer .files li.file .collaborators a img{border-radius:10px;width:100%;height:100%}")