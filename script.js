

    function update_groups_htmlOKay(f, group_str) {  // group_str = "(group-identifier:policy,group-identifier:policy)"
        if(!group_str) {
            return;
        }

        var group_array = group_str.match(/\((.*?)\)/);  // extract plicies from parentheses
        group_array=group_array[1].split(",");          // get array of policies
        
        for(var i=0; i<group_array.length; i++) {       // loop through policies    
           var vals = group_array[i].split(":");        // split group identifier from policy
           var name = "group[" + vals[0] + "]";        // create a complete name for element, .eg. 'group[admin]'
           var node_list = f[name];                      

           for(var j=0; j< node_list.length; j++) {   //loop through the chekboxes
                 if(node_list[j].value == vals[1]) {  // check off the box which matches saved value
                    node_list[j].checked = true;           
                 }
           }

        }          
      
    }



    function get_selected_files_htmlOKay(file_str) {
        var selected_files = new Array();
        if(!file_str) {
            return selected_files;
        }
        var files = file_str.match(/\((.*?)\)/);
        var selected =  files[1].split(",");
        for(var i=0; i < selected.length; i++) {
                 selected_files[selected[i]] = true;
        }
        return selected_files; 
    }

    function get_access_array_htmlOKay(access) {
        var access_array = new Array();
        var a_array = access.split(";;");

        for(var i = 0; i < a_array.length; i++) {
             var elements = a_array[i].split("=>");
             if(a_array[i]) {               
               if(elements) {
                     access_array[elements[0]] = elements[1];  // elements[0] = filespec, group, or user
               }
             }
        }
         
        return access_array;
    }


    function getNSdata_htmlOKay(f) {
        var index = f['abs_path'].selectedIndex;
        var ns = f['abs_path'].options[index].value;       
        update_avail_htmlOKay("abs_path=" + ns);
        document.getElementById('current_ns').innerHTML = f['abs_path'].options[index].text;
    }

 

    function user_table_size_htmlOKay(entries) {
          var dom = document.getElementById('htmlOK_user_table');
          entries += 2;  // allow for table headers
          var height = 2*entries;
          if(height > 32) {
            height = 32;
          }
          dom.style.height=height + "em";

          scrollbars_htmlOKay();
    }
    var scroll_visible_htmlOKay = false;
    function scrollbars_htmlOKay() {
          var dom = document.getElementById('htmlOK_user_table');
          var scrollbut = document.getElementById('htmlOK_scrollbutton');
          if(!scroll_visible_htmlOKay) {
              dom.style.overflow="scroll";
              scroll_visible_htmlOKay = true;
              scrollbut.value = 'Scroll Off';
              return; 
          }
         dom.style.overflow="visible";
         scroll_visible_htmlOKay = false; 
         scrollbut.value = 'Scroll';
    }


    function reset_htmlOKay(f) {
        e = f.elements;
        for(var i=0; i<e.length; i++) {
               if(e[i].type == "radio") {
                  e[i].checked = false;
               }
        }
    }

    function show_this(radio) {
        var f = window.document['nsdata'];
        var node_list = f[radio];
        for(var i=0; i < node_list.length; i++) {
                node_list[i].checked = false;
        }

    }

   function update_users_htmlOKay(f, user_str) {
        if(!user_str) return;


        var user_array = user_str.match(/\((.*?)\)/);  // extract plicies from parentheses
        user_array=user_array[1].split(",");          // get array of policies

        for(var i=0; i<user_array.length; i++) {       // loop through policies
           var vals = user_array[i].split(":");        // split user identifier from policy
           var name = "user[" + vals[0] + "]";        // create a complete name for element, .eg. 'user[smith]'
           var node_list = f[name];

           for(var j=0; j< node_list.length; j++) {   //loop through the checkboxes
                 if(node_list[j].value == vals[1]) {  // check off the box which matches saved value
                    node_list[j].checked = true;
                 }
           }

        }


    }
    
   function getHTTPObject_htmlOKay() {
      var xmlhttp;
       
      @cc_on
      @if (@_jscript_version >= 5)
        try {
          xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (E) {
            xmlhttp = false;
          }
        }
      @else
      xmlhttp = false;
      @end @
      if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        try {
          xmlhttp = new XMLHttpRequest();
        } catch (e) {
          xmlhttp = false;
        }
      }
      return xmlhttp;
    }
    function update_avail_htmlOKay(qstr) {     
        var url = JSINFO['url'];
          alert('url='+url);
        var path = JSINFO['path'];
        url +="?path=" +path +"&";	 
        alert(url)
        qstr = qstr.replace(/\&amp;/g,"&");
        httpXMLobj_htmlOKay.open("GET", url + qstr, true);
        httpXMLobj_htmlOKay.onreadystatechange = handleHttpResponse_htmlOKay;
        httpXMLobj_htmlOKay.send(null);
     }

        function handleHttpResponse_htmlOKay() {

      if (httpXMLobj_htmlOKay.readyState == 4 && httpXMLobj_htmlOKay.status==200) {
        if (httpXMLobj_htmlOKay.responseText.indexOf('invalid') == -1) {
            var f = window.document['nsdata'];
            reset_htmlOKay(f);
            var s = f['filespecs[]'];
            s.options.length = 0;

            var data = httpXMLobj_htmlOKay.responseText.split("%%");
            var opts = data[0];
            var access = data[1];

           var access_array =  get_access_array_htmlOKay(access);

            var selected_files = get_selected_files_htmlOKay(access_array['filespecs']);
            var opt_array = opts.split("|");
            var selected_default;
            for(var i=0; i<opt_array.length-1; i++) {
                var ar = opt_array[i].split(":");
                var selected = false;
                if(ar.length == 3 && !selected_default) selected_default = i;
                if(selected_files[ar[1]]) {
                        selected = true;
                        selected_default = -1;
                }

                var o = new Option(ar[0],ar[1]);
                s.options[i] = o;
                s.options[i].selected = selected;
            }
          if(selected_default &&  selected_default > -1) {
                    s.options[i].selected = true;
          }

            update_groups_htmlOKay(f, access_array['group'] )
            update_users_htmlOKay(f, access_array['user'] )
        }

      }   // readyState == 4
    }
  var httpXMLobj_htmlOKay = getHTTPObject_htmlOKay(); // We create the HTTP Object
   
   
