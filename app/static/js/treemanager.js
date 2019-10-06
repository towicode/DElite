
/*
    This file serves as the file-tree manager
    It is very similar to the file manager but uses the JSTree plugin so there
    are a few modifications made to both the back-end and front-end to accomodate
*/


$(function () {

    var un = $.getCookie("deusername");
    var term = "/iplant/home/" + un;
    var encoded = encodeURI(term);

    var basepath = "iplant/home/"


    //  We only want the tree to init when we call the page.
    $.treeInit = function () {

        //  we have to destroy any existing data due to a bug with JSTree
        $('#jstree_demo_div').jstree("destroy");

        //  Then we create a new tree.
        //  We define URL as defiles
        //      The path to our backend
        //  Then we define the data
        //      In the function we use javascript parents to determine the paths
        //      we esentially walk up the parents adding them to a list
        //      once at the top, id===#, we can reverse the path and create our list

        //  We also pass listchildren to every node except the rootnode
        //  I'm not sure why JSTree is designed this way, but it excepts the root-node to be JSObject
        //  and subsequent nodes to just be a arraylist
        //      Therefore we add the tag ?listchildren=true to the subsequent calls
        //      so the backend knows what to do.
        $('#jstree_demo_div').jstree({
            'core': {
                'data': {
                    'url': function (node) {
                        return 'defiles/'
                    },
                    'data': function (node) {

                        //  Top node always has an id of #
                        if (node.id === '#') {
                            return 'path=' + encoded + '&tree=true';
                        }
                        else {
                            //  grab string name of parent
                            parent_id_string = node.parent;
                            //  grab element of parent
                            tmpparent = $('#jstree_demo_div').jstree(true).get_node(parent_id_string)

                            //  create list of all parents (empty for now)
                            ordered_parents = []
                            //  create a fail-safe so we don't crash anyones browser.
                            var limit = 0;

                            //  loop through all parent elements till we reach the root node.
                            while (tmpparent != null && tmpparent != false) {

                                //  # is the root node
                                if (tmpparent.id === "#") {
                                    break;
                                }
                                //  Failsafe so we don't crash any browsers
                                if (limit++ > 15) {
                                    break;
                                }
                                //  Add the id (label-name in this case) to the arraylist
                                ordered_parents.push(tmpparent.id)

                                // set the parent as the parent, and repeat.
                                tmpparent = $('#jstree_demo_div').jstree(true).get_node(tmpparent.parent)

                            }

                            //  reverse the list for easy coding
                            ordered_parents.reverse()
                            //  addstring is going to be our string builder.
                            //  for this loop
                            var addstring = ""

                            //  build the string base don the parents.
                            for (var i = 0; i < ordered_parents.length; i++) {
                                addstring += ordered_parents[i] + "/"
                            }

                            //  finally add-itself
                            addstring += node.text

                            //encoded and send via ajax query.
                            var temp_encoded = encodeURI(basepath + addstring);
                            return 'path=' + temp_encoded + '&tree=true&listchildren=true';
                        }
                    }
                }
            }
        });
    }
});

