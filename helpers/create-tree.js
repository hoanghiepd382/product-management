let cnt = 0;
function create_tree(arr, parent_id = ""){
    let tree = [];
    arr.forEach(item=>{
        if (item.parent_id === parent_id){
            cnt++;
            const newItem = item;
            newItem.index = cnt;
            const children = create_tree(arr, item.id);
            if (children.length>0){
                newItem.children = children;
            }
            tree.push(newItem);
        }
    
    });
    return tree;
}

module.exports.createTree = (arr, parent_id="")=>{
    cnt = 0;
    const tree = create_tree(arr, parent_id="");
    return tree;
    }
