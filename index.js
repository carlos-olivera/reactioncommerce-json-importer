/*
* Reactioncommerce import script
* INPUT: JSON base File
* OUTPUT: reaction commerce productos JSON format
*
* Created by: Carlos Olivera Terrazas, @carlos-olivera
* 2017
*/

var jf = require('jsonfile');
var DataTransform = require("node-json-transform").DataTransform;
var d = new Date();

/**
 * Configuration map
 * Assign INPUT column : OUTPUT column
 * Based on node-json-transform
 * Check docs on: https://github.com/bozzltron/node-json-transform
 */
var columnsMap = {
    _id:function(val) { return Math.random().toString(36).substring(2, 9) +
        Math.random().toString(36).substring(2, 9);},
    shopId:"J8Bhq3uTtdgwZx3rz",
    title:"MKT NAME",
    pageTitle: "COMPATIBILIDAD",
    type: "",
  	vendor: "Samsung",
    price: "PRECIO",
    googleplusMsg:"ÍTEM",
    description: "DESCRIPCION CONCATENADO",
    handle: "BASIC NAME",
    isVisible: "STATUS",
    hashtags: ['CATEGORIA'],
    metafields: ['Bateria','Interfaz','Potencia','Caracteristicas Generales','CONTENIDO DEL PACK','ESPECIFICACIONES FÍSICAS','Voltaje',
      'COMPATIBILIDAD','PANTALLA','MEMORIA','SENSORES','AUDIO Y VÍDEO','SERVICIOS Y APLICACIONES','CONECTIVIDAD', 'BLUETOOTH', 'LENTES',
      'LUZ','CÁMARA'],
    calcMetafields: function(val) { return [{'key':'Batería','value':val[0]},
            {'key':'Interfaz','value':val[1]},{'key':'Potencia','value':val[2]},{'key':'Detalles','value':val[3]},{'key':'Contenido pack','value':val[4]},
            {'key':'Especificaciones','value':val[5]},{'key':'Voltaje','value':val[6]},
            {'key':'COMPATIBILIDAD','value':val[7]},{'key':'PANTALLA','value':val[8]},{'key':'MEMORIA','value':val[9]},
            {'key':'SENSORES','value':val[10]},{'key':'AUDIO Y VÍDEO','value':val[11]},{'key':'SERVICIOS Y APLICACIONES','value':val[12]},
            {'key':'CONECTIVIDAD','value':val[13]},{'key':'BLUETOOTH','value':val[14]},{'key':'LENTES','value':val[15]},{'key':'LUZ','value':val[15]},
            {'key':'CÁMARA','value':val[15]}
            ]},
    assignHashTags: function(val) {
            	if (val[0] == "Baterias")
            			return ["cseCBSSrJ3t8HQSNP", "rpjCvTBGjh000xdro"];
            	if (val[0] == "Cargadores")
            			return ["rpjCvTBGjhBi2xdro", "rpjCvTBGjh000xdro"];
            	if (val[0] == "Fundas")
            			return ["rpjCvTBGjh333xdro", "rpjCvTBGjh000xdro"];
            	if (val[0] == "Adaptadores")
            			return ["rpjCvTBGjh444xdro", "rpjCvTBGjh000xdro"];
            	if (val[0] == "Wearable")
            			return ["rpjCvTBGjh666xdro"];
            	if (val[0] == "Audio")
            			return ["rpjCvTBGjh777xdro"];
              if (val[0] == "Vehiculo")
                  return ["rpjCvTBGjh888xdro", "rpjCvTBGjh000xdro"];
               if (val[0] == "SMARTPHONE")
                  return ["rpjCvTBGjh999xdro"];
              if (val[0] == "Fundas; Adaptadores")
                  return ["rpjCvTBGjh333xdro","rpjCvTBGjh444xdro", "rpjCvTBGjh000xdro"];
              if (val[0] == "Cargadores; Fundas")
                  return ["rpjCvTBGjhBi2xdro","rpjCvTBGjh333xdro", "rpjCvTBGjh000xdro"];
              if (val[0] == "Cargadores; Vehiculo")
                  return ["rpjCvTBGjhBi2xdro","rpjCvTBGjh888xdro", "rpjCvTBGjh000xdro"];
            },
    fnVisible: function(val){
              if (val == "OK")
                  return true;
              if (val == "NO")
                  return false;
              if (val == "")
                  return false;
            },
    variant_id: "",
  	variantTitle: "ÍTEM",
  	variantSku: "BASIC NAME",
  	variantOptionTitle: "COLOR",
    isVisible: "STATUS",
    price: "PRECIO",
    inventoryQuantity: "Cantidad",
    barcode:"ÍTEM",
  	type: ""
}



/**
 * walk array
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function walkclean(test) {
  var newObj = [];
  var seBorra = false;
  for (var obj in test) {
    var newItem = {};
    seBorra = false;
    for (var propName in test[obj]) {
      if (test[obj][propName] === null || test[obj][propName] === '' || test[obj][propName] === '-') {
        seBorra = true;
      }
    }
    if (!seBorra) {
        newItem = test[obj];
        newObj.push(newItem);
    }
  }
  return newObj;
}

/**
 * check and purge
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function depurar(test) {
	var newObj = [];

		for (var i in test) {
			var cityObj = test[i];

			var newItem = {};

			var foundItem = false;
			for (var j in newObj) {
				var existingItem = newObj[j];
				if ((newObj[j].handle == cityObj.handle) || (cityObj.handle=="") || (cityObj.handle==null)){
					foundItem = j;
				}
			}
			if (!foundItem) {
				newItem = cityObj;
				newObj.push(newItem);
			} else {

			}
		}
    return newObj;
}

/**
 * Put ancestors values
 * @param  {[type]} variants [description]
 * @param  {[type]} newObj   [description]
 * @return {[type]}          [description]
 */
function putAncestors(variants,newObj) {
		for (var i in variants) {
				var cityObj = variants[i];
				var newItem = {};
				for (var j in newObj) {
					if (newObj[j].sku== cityObj.title){
						newObj[j].ancestors = [cityObj.ancestors[0],cityObj._id];
					}
				}
			}
		for (var j in newObj) {
			delete newObj[j].sku;
			}
	    return newObj;
};

/**
 * 
 * Check ancestors
 * 
 * @param {any} variants 
 * @param {any} newObj 
 * @returns 
 */
function visibleAncestor(variants,newObj) {
    for (var i in variants) {
        var cityObj = variants[i];
        for (var j in newObj) {
          if (newObj[j]._id == cityObj.ancestors[0]){
               if ((newObj[j].isVisible == false) && (cityObj.isVisible == true)) {
                   newObj[j].isVisible = true;
               }
          }
        }
      }
      return newObj;
};

/**
 * create Variants array
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function crearVariant(test) {

	var newObj = [];

		for (var i in test) {
			var cityObj = test[i];

			var newItem = {
			  _id: Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9),
			  ancestors: [
			    cityObj._id
			  ],
			  title: cityObj.handle,
			  price: cityObj.price.max,
			  inventoryManagement: true,
			  inventoryPolicy: true,
			  //inventoryQuantity: cityObj.inventoryQuantity,
			  isVisible: cityObj.isVisible,
        barcode: cityObj.googleplusMsg,
			  updatedAt: {
			    "$date": d.toISOString()
			  },
			  createdAt: {
			    "$date": d.toISOString()
			  },
			  weight: 1,
			  metafields: [{
    			"key": null,
    			"value": null
  			  }],
			  shopId: cityObj.shopId,
			  taxable: true,
			  type: "variant"
			}
			newObj.push(newItem);
		}
  return newObj;
}

var map = {
    list : 'records',
    item: {
      _id: "",
      shopId: columnsMap.shopId,
  		title: columnsMap.title,
  		pageTitle: columnsMap.pageTitle,
  		type: "",
  		vendor:"",
      price: columnsMap.price,
      googleplusMsg:columnsMap.googleplusMsg,
      description: columnsMap.description,
      handle: columnsMap.handle,
      isVisible: columnsMap.isVisible,
      hashtags: columnsMap.hashtags,
      metafields: columnsMap.metafields
    },
    operate: [
        {
            run: columnsMap._id, on: "_id"
        },
        {
            run: function(val) { return columnsMap.shopId}, on: "shopId"
        },
        {
            run: function(val) { return "simple"}, on: "type"
        },
        {
            run: function(val) { return columnsMap.vendor}, on: "vendor"
        },
        {
            run: function(val) { return {range:val.toString(),min:1,max:Number(val)}}, on: "price"
        },
        {
            run: columnsMap.calcMetafields, on: "metafields"
        },
        {
            run: columnsMap.assignHashTags, on: "hashtags"
        },
        {
            run: columnsMap.fnVisible, on: "isVisible"
        }
    ],
    each: function(item){
        item.title = item.title + " - " + item.handle;
        item.handle = item.handle.toLowerCase();
        item.isLowQuantity= false;
        item.isSoldOut= false;
        item.isBackorder= false;
        item.ancestors= [];
        item.createdAt= {
          		"$date": d.toISOString()
        		};
        item.updatedAt= {
          		"$date": d.toISOString()
        		};
        item.metafields=walkclean(item.metafields);
        return item;
    }
};
var mapVariants = {
    list : 'records',
    item: {
        _id: columnsMap.variant_id,
        shopId: "",
  		title: columnsMap.variantTitle,
  		sku: columnsMap.sku,
  	    optionTitle: columnsMap.variantOptionTitle,
        isVisible: columnsMap.isVisible,
        price: columnsMap.price,
        inventoryQuantity: columnsMap.inventoryQuantity,
        barcode:columnsMap.barcode,
  	    type: "",
    },
    operate: [
        {
            run: columnsMap._id, on: "_id"
        },
        {
            run: function(val) { return columnsMap.shopId}, on: "shopId"
        },
        {
            run: function(val) { return "variant"}, on: "type"
        },
        {
            run: function(val) { return Number(val)}, on: "price"
        },
        {
            run: function(val) { return Number(val)}, on: "inventoryQuantity"
        },
        {
            run: columnsMap.fnVisible, on: "isVisible"
        }
    ],
    each: function(item){

      if ((item.optionTitle == "-") || (item.optionTitle == "")) {
        item.optionTitle = item.title;
      }
      item.inventoryManagement= true;
  		item.inventoryPolicy= true;
  		item.weight=1;
  		item.isDeleted=false;
      item.sku = item.sku.toLowerCase();
  		item.metafields= [{
    			"key": null,
    			"value": null
  			  }];
  		item.taxable=true;
        item.ancestors= [];
        item.createdAt= {
          		"$date": d.toISOString()
        		};
        item.updatedAt= {
          		"$date": d.toISOString()
        		};
        return item;
    }
};

/**
 * 
 */
function checkIfArrayIsUnique(myArray) {
  return myArray.length === new Set(myArray).size;
  }

/**
 * Main function
 * @return {[type]} [description]
 */
function doIt() {

     if (process.argv.length < 4 ) {
         console.log("Too few arguments");
         console.log("Use: input=INPUTFILE output=OUTPUTFILE");
         return
     }

     if ((process.argv[2].split("=")[0] != "input") || (process.argv[3].split("=")[0] != "output")) {
         console.log("Error in arguments");
         console.log("Use: input=INPUTFILE output=OUTPUTFILE");
         return
     }

	  var inputFile = process.argv[2].split("=")[1];
      var outPutFile = process.argv[3].split("=")[1];
      var obj2 = jf.readFileSync(inputFile);
      var dataTransform = DataTransform(obj2, map);
	  var masters = depurar(dataTransform.transform());

	  var primaryVariants = crearVariant(masters);
	  var dataTransformVariant = DataTransform(obj2, mapVariants);
	  var resultVariant = dataTransformVariant.transform();
	  var mastersVariants = putAncestors(primaryVariants,resultVariant);
	  var masterVisible = visibleAncestor(mastersVariants,masters);
	  var conVariants = masterVisible.concat(primaryVariants);
	  var finalArr = conVariants.concat(mastersVariants);

	  jf.writeFile(outPutFile, finalArr, function (err) {
	     console.error(err);
	     console.log(finalArr.length);
	  })
};

doIt();