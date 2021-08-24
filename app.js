// Module patterns

// item controller module

const itemctrl = (function()
{
const inform = function(id , name , calorie)
{
    this.id = id;
    this.name = name;
    this.calorie = calorie;
}
    
    const data = {
        items:[
            // {id:0 , name:'dinner' , totalCalorie:500},
             // {id:1 , name:'breakfast' , totalCalorie:300},
             // {id:2 , name:'lunch' , totalCalorie:400},

        ],
        currentItem:null,
        totalCalorie:0,
    }

    return {
        getitems: function()
        {
            return data.items;
        },
        addItem: function( name , calorie)
        {
          let ID;
        
        
          // create id
          if(data.items.length > 0)
          {
              ID = data.items[data.items.length -1].id + 1;
          }  
          else
          {
              ID = 0;
          }
           // calories to number

          calorie = parseInt(calorie);

          // create new item
          newItem = new inform(ID, name , calorie);

          data.items.push(newItem);
          
          return newItem;
        },
        getitembyid: function(id)
        {
           let found = null;
           data.items.forEach(function(item)
           {
               if(item.id === id)
               found = item;
           });
           return found;
        },
        updateItem:function(name , calorie)
        {
          calorie = parseInt(calorie);
          let found = null;
          data.items.forEach(function(item)
          {
              if(item.id === data.currentItem.id)
              {
                  item.name = name;
                  item.calorie = calorie;
                  found = item;
              }
          });
          return found;
        },
        deleteItem: function(id)
        {
           const ids = data.items.map(function(item)
           {
              return item.id;
           });
           const index = ids.indexOf(id);
           // remove from data structure
           data.items.splice(index , 1);
        },
        clearAllItems: function()
        {
           data.items=[];
        },
        setcurrentitem: function(item)
        {
           data.currentItem = item;
          // console.log(item);
        },
        getcurrentitem: function()
        {
           return data.currentItem;
        },
        getTotalCalories: function()
        {

          let total = 0;
          data.items.forEach(function(item)
          {
              total += item.calorie;
          });
          // set total calories in data structure
          data.totalCalorie = total;
          return data.totalCalorie;
        },
         logData:function()
        {
            return data;
        }  
    }
})();

// UI Controller
 const uictrl = (function()
 {
     const UISelectors = {
         itemlist: '#item-list',
         listItems: '#item-list li',
         addbtn: '.add-btn',
         updatebtn:'.update-btn',
         deletebtn:'.delete-btn',
         backbtn:'.back-btn',
         itemname: '#item-name',
         itemcalorie:'#item-calories',
         totalcalories:'.total-calories',
         clearbtn:'.clear-btn'
 }
     return {
   populateitemlist: function(items)
   {
   let html = '';
   items.forEach(function(item)
   {
     html += `<li class="collection-item" id="item-${item.id}">
     <strong> ${item.name}:</strong> <em>${item.totalCalorie} Calories</em>
     <a href ="#" class="secondary-content">
     <i class="edit-item fas fa-pencil-alt"></i>
     </a>
     </li> `;
   });
   document.querySelector(UISelectors.itemlist).innerHTML = html;
   },
   getItemInput: function()
   {
       return {
       name:document.querySelector(UISelectors.itemname).value,
       calorie:document.querySelector(UISelectors.itemcalorie).value,
       }
   },
   addListItem:function(item)
   {
       document.querySelector(UISelectors.itemlist).style.display = 'block';
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.id = `item-${item.id}`;
    li.innerHTML = `<strong> ${item.name}:</strong> <em>${item.calorie} Calories</em>
    <a href ="#" class="secondary-content">
    <i class="edit-item fas fa-pencil-alt"></i>
    </a>`;
    // Insert item
    document.querySelector(UISelectors.itemlist).insertAdjacentElement('beforeend' , li)
   },
     clearInput: function()
         {
           document.querySelector(UISelectors.itemname).value = '';
           document.querySelector(UISelectors.itemcalorie).value = '';

         },
         additemtoform: function()
         {
            document.querySelector(UISelectors.itemname).value = itemctrl.getcurrentitem().name;
            document.querySelector(UISelectors.itemcalorie).value = itemctrl.getcurrentitem().calories; 
            uictrl.editstate();

         },
         hideList: function()
         {
             document.querySelector(UISelectors.itemlist).style.display = 'none';
         },
         showTotalCalories: function(totalCalories)
         {
            document.querySelector(UISelectors.totalcalories).textContent = totalCalories;
         },
         clearItemInput:function()
         {
             uictrl.clearInput();
            document.querySelector(UISelectors.addbtn).style.display = 'inline';
            document.querySelector(UISelectors.updatebtn).style.display = 'none';
            document.querySelector(UISelectors.deletebtn).style.display = 'none';
            document.querySelector(UISelectors.backbtn).style.display = 'none';
         },
         updateListItem: function(item)
         {
             let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem)
            {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`)
                {
                document.querySelector(`#${itemID}`).innerHTML = `<strong> ${item.name}:</strong> <em>${item.calorie} Calories</em>
                <a href ="#" class="secondary-content">
                <i class="edit-item fas fa-pencil-alt"></i>`
            }});
         },
         clearUI: function()
         {
             let listItems = document.querySelectorAll(UISelectors.listItems);
             // convert into array
             listItems = Array.from(listItems);
             listItems.forEach(function(listItem)
             {
                listItem.remove();
             });
         },
         deleteListItem: function(id)
         {
            const itemID = `#item-${id}`;
            document.querySelector(itemID).remove();
         },
         editstate: function()
         {
         document.querySelector(UISelectors.addbtn).style.display = 'none';
         document.querySelector(UISelectors.updatebtn).style.display = 'inline';
         document.querySelector(UISelectors.deletebtn).style.display = 'inline';
         document.querySelector(UISelectors.backbtn).style.display = 'inline';
         },

   getSelectors: function()
   {
       return UISelectors;
   }
}
 })();

 // App Controller

const appctrl = (function(itemctrl , uictrl)
 {
     const loadeventlisteners = function()
     {
         // get ui selectors
         const UISelectors = uictrl.getSelectors();
         
         // Add item event
         document.querySelector(UISelectors.addbtn).addEventListener('click' , addMeal);

         // disable submit on enter

         document.addEventListener('keypress' , function(e)
         {
             if(e.keyCode === 13 || e.which === 13)
             {
                 e.preventDefault();
                 return false;
             }
         });
         document.querySelector(UISelectors.itemlist).addEventListener('click' , update);

         //update item event
         document.querySelector(UISelectors.updatebtn).addEventListener('click' , itemUpdateSubmit);
         document.querySelector(UISelectors.deletebtn).addEventListener('click' , itemDeleteSubmit);
         document.querySelector(UISelectors.backbtn).addEventListener('click' , uictrl.clearItemInput);
         document.querySelector(UISelectors.clearbtn).addEventListener('click' , clearAll);

     }
     const addMeal = function(e)
     {
         console.log('add');
         //get item input from uictrl
         const input = uictrl.getItemInput();

         // Check for name and calorie input

         if(input.name !=='' && input.calorie !=='')
           {
           const newItem = itemctrl.addItem(input.name , input.calorie);
    //          // Add item to the ui
              uictrl.addListItem(newItem);

    //           // get total calories
             
             const totalCalories = itemctrl.getTotalCalories();

    //          // add total calories to the ui
            uictrl.showTotalCalories(totalCalories);

              // clear fields
              uictrl.clearInput();
        }
    
         e.preventDefault();
      }
     const update = function(e)
     {
         if(e.target.classList.contains('edit-item'))
         {
             // get id 
             const listid = e.target.parentNode.parentNode;
           // console.log(listid.id);
           //  split into array
             const listidarr = listid.id.split('-');
            // console.log(listidarr);
             const id = parseInt(listidarr[1]);
             const itemedit = itemctrl.getitembyid(id);
             console.log(itemedit);
             itemctrl.setcurrentitem(itemedit);

              // Add item to form
              uictrl.additemtoform();
         }
         e.preventDefault();
     }
     const itemUpdateSubmit = function(e)
     {
        // console.log('hello');
         const input = uictrl.getItemInput();
          
          input.calorie = parseInt(input.calorie);
          console.log(input);
        // updated item
         const updatedItem = itemctrl.updateItem(input.name , input.calorie);
          uictrl.updateListItem(updatedItem);

          const totalCalories = itemctrl.getTotalCalories();

                // add total calories to the ui
          uictrl.showTotalCalories(totalCalories);
          uictrl.clearItemInput();
         e.preventDefault();
     }
     const itemDeleteSubmit = function(e)
     {
         const currentItem = itemctrl.getcurrentitem();
         itemctrl.deleteItem(currentItem.id);
         uictrl.deleteListItem(currentItem.id);
         const totalCalories = itemctrl.getTotalCalories();

         // add total calories to the ui
         uictrl.showTotalCalories(totalCalories);
         
         uictrl.clearItemInput();
         e.preventDefault();
     }
     const clearAll = function(e)
     {
         // removing from data structure
        itemctrl.clearAllItems();
        // removing from the ui
       
        const totalCalories = itemctrl.getTotalCalories();

        // add total calories to the ui
        uictrl.showTotalCalories(totalCalories);

        uictrl.clearUI();
        // hide UL
        uictrl.hideList();

     }
     return {
          init: function()
          {
              uictrl.clearItemInput();
              console.log('Initializing app');
              const items = itemctrl.getitems();

              // check if any items
              if(items.length === 0)
              {
                  uictrl.hideList();

              }
              else
              {
              uictrl.populateitemlist(items);
              }
              const totalCalories = itemctrl.getTotalCalories();

              // add total calories to the ui
             uictrl.showTotalCalories(totalCalories);
 
              loadeventlisteners();
          },
      }
 })(itemctrl , uictrl);
 appctrl.init();