//T/////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************************** TRIE.JS***********************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////

Trie.NODE_WIDTH = 30; //tamaño de cada circulo
/***********************************Colores del los Circulos******************************************/
Trie.LINK_COLOR = "#000000";
Trie.HIGHLIGHT_CIRCLE_COLOR = "#000000"; //color de circulo
Trie.FOREGROUND_COLOR = "#000000";
Trie.BACKGROUND_COLOR = "#CCFFCC";
Trie.TRUE_COLOR = "#b3b6b7";
Trie.PRINT_COLOR = Trie.FOREGROUND_COLOR; //trie
Trie.FALSE_COLOR = "#FFFFFF"
Trie.WIDTH_DELTA  = 50;
Trie.HEIGHT_DELTA = 50;
Trie.STARTING_Y = 80;
Trie.LeftMargin = 300;

Trie.FIRST_PRINT_POS_X  = 50;
Trie.PRINT_VERTICAL_GAP  = 20;
Trie.PRINT_HORIZONTAL_GAP = 50;

/********************************************************************************************************/

function Trie(am, w, h)
{
	this.init(am, w, h);//inicializacion de las Variables
}
//
Trie.prototype = new Algorithm();
Trie.prototype.constructor = Trie;//constructor TRIE
Trie.superclass = Algorithm.prototype;
//

Trie.prototype.init = function(am, w, h)
{
	//Mensaje enviado a la parte Inferior con amimacion
	var sc = Trie.superclass;//superclase Trie
	this.startingX =  w / 2;
	this.first_print_pos_y  = h - 2 * Trie.PRINT_VERTICAL_GAP;
	this.print_max  = w - 10;

	var fn = sc.init;// inicializacion
	fn.call(this,am); // ingreo de string
	this.addControls(); //agregacion de Controles
	this.nextIndex = 0; //Indice
	this.commands = [];
	this.cmd("CreateLabel", 0, "", 20, 10, 0);// ESPACIO DE MARGEN DEL GRAFICO
	this.cmd("CreateLabel", 1, "", 20, 10, 0);//..
	this.cmd("CreateLabel", 2, "", 20, 30, 0);//..
	this.nextIndex = 3;
	this.animationManager.StartNewAnimation(this.commands);//Inicilizacion comando de Animcion
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}
//

/***********************************************BOTONES*************************************************/
Trie.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("Text", "");
	this.insertField.onkeypress = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 12,false);
	this.insertButton = addControlToAlgorithmBar("Button", "Insertar");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("Text", "");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 12);
	this.deleteButton = addControlToAlgorithmBar("Button", "Borrar");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
	this.findField = addControlToAlgorithmBar("Text", "");
	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 12);
	this.findButton = addControlToAlgorithmBar("Button", "Buscar");
	this.findButton.onclick = this.findCallback.bind(this);
	this.printButton = addControlToAlgorithmBar("Button", "Mostar");
	this.printButton.onclick = this.printCallback.bind(this);
}
//



Trie.prototype.reset = function()// funcion Reset
{
	this.nextIndex = 5;
	this.root = null;
}
/**************************************INSERCION DE LLAMADA*********************************************/

//Insertar
Trie.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value.toUpperCase() //declara variable
        insertedValue = insertedValue.replace(/[^a-z]/gi,''); //insert tipo de variable string

	if (insertedValue != "")
	{
		this.insertField.value = "";
		this.implementAction(this.add.bind(this), insertedValue); // enlazar
	}
}

//Borrar
Trie.prototype.deleteCallback = function(event) //borrado de llamada
{
	var deletedValue = this.deleteField.value.toUpperCase(); // a mayusculas
        deletedValue = deletedValue.replace(/[^a-z]/gi,''); // borrado de la palabra
	if (deletedValue != "") // espacio para las letras 
	{
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this),deletedValue);//enlazar		
	}

}

//Mostar
Trie.prototype.printCallback = function(event)
{
	this.implementAction(this.printTree.bind(this),"");	// enlazar ña animacion y muestra el Arbol					
}


//Encontrar
Trie.prototype.findCallback = function(event)
{
	var findValue = this.findField.value.toUpperCase() //Magusculas
        finndValue = findValue.replace(/[^a-z]/gi,''); // Encontrar la letra
	this.findField.value = ""; //mensague
	this.implementAction(this.findElement.bind(this),findValue);						
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************************************** MOSTRAR*************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Nota: This: esta determinado 

Trie.prototype.printTree = function(unused) //no usado Trie
{

	this.commands = []; //Comando Consola
    
	if (this.root != null) //si el arbol no esta vacio
	{
		this.highlightID = this.nextIndex++;//Id va en Aumento de la Raiz
	    this.printLabel1 = this.nextIndex++;//..
	    this.printLabel2 = this.nextIndex++;//..
		var firstLabel = this.nextIndex++;//..
	    this.cmd("CreateLabel", firstLabel, "Salida: ", Trie.FIRST_PRINT_POS_X, this.first_print_pos_y);// crea etique ta en el Arbol en el Lienzo X Y y
		this.cmd("CreateHighlightCircle", this.highlightID, Trie.HIGHLIGHT_CIRCLE_COLOR, this.root.x, this.root.y);//cREA CIRCULO de Color 
        this.cmd("SetWidth", this.highlightID, Trie.NODE_WIDTH); //Establecer ancho
		this.cmd("CreateLabel", this.printLabel1, "                                                                                Mostrando cadena actual: ", 20, 10, 0);
		// mensaje centrado
	    this.cmd("CreateLabel", this.printLabel2, "", 20, 10, 0);// Espacio en el lienzo
	    this.cmd("AlignRight", this.printLabel2, this.printLabel1);// Alinear a la derecha
		this.xPosOfNextLabel = Trie.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel = this.first_print_pos_y;
		this.printTreeRec(this.root, "");// Mostrar Arbol

		this.cmd("Delete",  this.highlightID); //Comandos
		this.cmd("Delete",  this.printLabel1);//..
		this.cmd("Delete",  this.printLabel2);//..
		this.cmd("Step") //paso
		
		// mensaje que se muesta , es actualizado contrantemente
		for (var i = firstLabel; i < this.nextIndex; i++)
		{
			this.cmd("Delete", i); //Mensaje de Borrado
		}
		this.nextIndex = this.highlightID; 
	}
	return this.commands; //Mensaje de Borrado


}


/********************************************* MOSTRAR REC************************************************/

Trie.prototype.printTreeRec = function(tree, ) // Funcion Imprimir Arbol, Mostrar arbol, cadena hasta ahora
{
    if (tree.isword) // el arbol tienes palabras
    {
	var nextLabelID = this.nextIndex++; // declaracon
		this.cmd("CreateLabel", nextLabelID, stringSoFar + "  ", 20, 10, 0); // espacio en el lienzo
		/**/	
	this.cmd("SetForegroundColor", nextLabelID, Trie.PRINT_COLOR); 
	this.cmd("AlignRight", nextLabelID, this.printLabel1, Trie.PRINT_COLOR); 
	this.cmd("MoveToAlignRight", nextLabelID, nextLabelID - 1);
		/**/
	this.cmd("Step"); //paso
	
	//
    }
    for (var i = 0; i < 26; i++)
    {
	if (tree.children[i] != null)
	{
	//

	var stringSoFar2 = stringSoFar + tree.children[i].wordRemainder;
	var nextLabelID = this.nextIndex++;
	
	// velocidad de transicion de la letras en el mensage
	var fromx =  (tree.children[i].x + tree.x) / 2 + Trie.NODE_WIDTH / 2;
	var fromy =  (tree.children[i].y + tree.y) / 2
	;
        this.cmd("CreateLabel", nextLabelID, tree.children[i].wordRemainder,fromx, fromy, 0);
	this.cmd("MoveToAlignRight", nextLabelID, this.printLabel2);
	this.cmd("Move", this.highlightID, tree.children[i].x, tree.children[i].y);
	this.cmd("Step");
	this.cmd("Delete", nextLabelID);
	this.nextIndex--;
	this.cmd("SetText", this.printLabel2, stringSoFar2);

	this.printTreeRec(tree.children[i], stringSoFar2);
	this.cmd("Move", this.highlightID, tree.x, tree.y);
	this.cmd("SetText", this.printLabel2, stringSoFar);
	this.cmd("Step");
	    
	}
	///
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************************************** BUSQUEDA*************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////


Trie.prototype.findElement = function(word) //encontrar elemento y mostrarlo 
{
	this.commands = []; // comando consola
	
	this.commands = new Array(); 
	this.cmd("SetText", 0, "Buscando: ");//mensage
	this.cmd("SetText", 1, "\"" + word  + "\"");//espacio entre las palabras
    this.cmd("AlignRight", 1, 0);//alinear hacia la derecha
    this.cmd("Step");//paso

	//encontar
	var node = this.doFind(this.root, word);// se define a Node
        if (node != null) // si el nodo no esta vacio entramos al IF
        {
             this.cmd("SetText", 0, "Se Encontro \""+word+"\""); // se muestra mensage que se encontro
        }
        else // de lo contrario
        {
             this.cmd("SetText", 0, "\""+word+"\" No se Encontro"); // se muestra mensage que no se encontro 
        }

        this.cmd("SetText", 1, ""); // envio de mensage
        this.cmd("SetText", 2, "");// envio de mensage
	
	return this.commands;// retorna
}

//Encontrar
Trie.prototype.doFind = function(tree, s) // valores
{

    if (tree == null) //si el arbo es Null
    {
		return null; // no es muestra nada
	}

    this.cmd("SetHighlight", tree.graphicID , 1);// muestra anmimacion y muetra el arbol
	/**/
	if (s.length == 0)//comienza la longitud si es 0
	/**/
	//si es numero mayor no encontrara la palabra
    {
        if (tree.isword == true)
        {
			// muestra mensaje
			this.cmd("SetText", 2, " \nLa Palabra esta el Arbol");//mensage
			this.cmd("Step");//paso
			// muestra el resultado
            this.cmd("SetHighlight", tree.graphicID , 0);//muestra
	    return tree
	}
	else
	{
			// muestra mensaje
			this.cmd("SetText", 2, " \nLa Palabra no esta el Arbol");//mensage
			this.cmd("Step");//paso
			// muestra el resultado
            this.cmd("SetHighlight", tree.graphicID , 0);// establecer resaltado
	    return null

	}
	}
	/**/
    else 
    {
      // this.cmd("SetHighlightIndex", 1, 1);
       var index = s.charCodeAt(0) - "A".charCodeAt(0);// acetacion de la palabra
       if (tree.children[index] == null) // si los nodos raiz estan vacios
       {
		   
            this.cmd("SetText", 2, "Nodo" + s.charAt(0) + " No existe\nLa palabra no existe el el Arbol");
			//conjuto de texo , nodo, ejecucion del mensaje
			this.cmd("Step");
			//paso
            this.cmd("SetHighlight", tree.graphicID , 0); // muestra el arbol
	    return null // No retorna nada
		}
	// busqueda Nodo por nodo	
	//comenzando con el primer circulo
 	this.cmd("CreateHighlightCircle", this.highlightID, Trie.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);//todo el espacio donde esta el arbol
        this.cmd("SetWidth", this.highlightID, Trie.NODE_WIDTH);// primer nodo y nodoso hijos
       
          this.cmd("Step")// paso
          this.cmd("SetHighlight", tree.graphicID , 0);//muestra el grafico
          //this.cmd("SetHighlightIndex", 1, -1);
          //this.cmd("SetText", 1, "\"" + s.substring(1) + "\"");
		  //efecto de moviemitos del rodo raiz, nodo hijo, hijos
          this.cmd("Move", this.highlightID, tree.children[index].x, tree.children[index].y);
          this.cmd("Step")//paso
 	   this.cmd("Delete", this.highlightID);// en el caso de borrado
	  return this.doFind(tree.children[index], s.substring(1)) // restorna que se encontro la palabra.
    }
}
/**********************************************************************************************************/
Trie.prototype.insertElement = function(insertedValue)
{
	this.cmd("SetText", 0, "");	// consola de insert 		
	return this.commands; // comando
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*************************************************BORRAR**************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////

Trie.prototype.deleteElement = function(word)// funcon borrado , funcion mas declaracion de una varible palabra
{
	this.commands = [];//inicio de los comandos
	this.cmd("SetText", 0, "Borrando ");// mensaje de borrado
	this.cmd("SetText", 1, "\"" + word  + "\""); // separadores con slash
    this.cmd("AlignRight", 1, 0);
	this.cmd("Step"); //paso
		
	//la sentencia var por lo general declara varibles
	var node = this.doFind(this.root, word);// trae la funcion encontrar


        if (node != null) // si el nodo es  diferente a null, ingresamos al If
        {
  	    this.cmd("SetHighlight", node.graphicID , 1);//mostra e arb.ol con nodos
	  
		  
		this.cmd("step")//paso
		// verifica si llega a Color se significado falso
	    this.cmd("SetBackgroundColor", node.graphicID, Trie.FALSE_COLOR);
			node.isword = false // esta en falso
			this.cmd("SetHighlight", node.graphicID , 0);//efecto

	    this.cleanupAfterDelete(node)// borra el nodo
	    this.resizeTree()//redimencionar el arbol
        }
        else // de lo contrario
        {
         
	    this.cmd("step") //paso
             this.cmd("SetHighlightIndex", 1,  -1)//muestra el arbol
        }



	this.cmd("SetText", 0, "");//mensajes salida
	this.cmd("SetText", 1, "");//mensajes salida
	this.cmd("SetText", 2, "");//mensajes salida
	return this.commands;		// retorna 
	//				
}


/***********************************************************************/
//nodo//
Trie.prototype.numChildren = function(tree) // numero de hijos
{
    if (tree == null)// si el arbol es igual a null retorna 0
    {
        return 0;// retorna
    }
    var children = 0 //declara variable
    for (var i = 0; i < 26; i++) // lo que haces es hacer un recorrido con I jasta que sea menor que 26  
    {
        if (tree.children[i] != null) // si es diferente a NUll
        {
            children++; // continua aumento
        }
    }
    return children; // retorna nodos hijo

}
/************************************************************************/
//limpiar depsues de borrar//
Trie.prototype.cleanupAfterDelete = function(tree) //funcion de limpiar
{
    var children = this.numChildren(tree) // se declara hijos y arbol

	if (children == 0 && !tree.isword) 
	//si el arbol es igual a 0 y si el arbol no tiene palabras
    {

   	 this.cmd("SetHighlight" ,tree.graphicID , 1); //mostrar el arbol
         this.cmd("Step");//Comando paso
   	 this.cmd("SetHighlight", tree.graphicID , 0); //mostar el arbol
         if (tree.parent != null) //si es diferernte a null
         {
              var index = 0 //declaramos variable
              while (tree.parent.children[index] != tree)//diferente al arbol
              {
                  index++; //AUMENTO
              }
			  this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID); // efecto disconect
       	      this.cmd("Delete", tree.graphicID , 0); // efecto de borrado en cadera
              tree.parent.children[index] = null; //la raiz asigna null
              this.cleanupAfterDelete(tree.parent);// limpiar
         }
         else // de lo contrario
         {
			this.cmd("Delete", tree.graphicID , 0); // borrar el nodod raiz
            this.root = null; // raiz null
         }
    }
}
/*************************************************************************/
 // redimencionar//

Trie.prototype.resizeTree = function()// funcion redimencionar
{
	this.resizeWidths(this.root); //redimencionar 
	if (this.root != null) //  si la raiz es diferente a Null
	{
			var startingPoint = this.root.width / 2 + 1 + Trie.LeftMargin;//pisicion de los nodos en el lienzo
		    //var startingPoint = this.root.width / 10 + 10 + Trie.LeftMargin;//

		this.setNewPositions(this.root, startingPoint, Trie.STARTING_Y);//
		this.animateNewPositions(this.root);// amimacion en posicinanmiento de los nodos
		this.cmd("Step");//paso
	}
	
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************************INSERCION*************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////


Trie.prototype.add = function(word) //funcion AGREGAR, palabras
{
	this.commands = new Array(); // cadena
	this.cmd("SetText", 0, "Insertando; ");//enviar mensaje 2Insertando"
	this.cmd("SetText", 1, "\"" + word  + "\"");// espacio para el mensage
    this.cmd("AlignRight", 1, 0); // alinear a la derecha
	this.cmd("Step");//paso
	
        if (this.root == null) //si la raiz es igual a null, ingresamos al If
        {
		this.cmd("CreateCircle", this.nextIndex, "", Trie.NEW_NODE_X, Trie.NEW_NODE_Y); // creaMOS el nodo en la Raiz, en el espacio central X,Y
		this.cmd("SetForegroundColor", this.nextIndex, Trie.FOREGROUND_COLOR);// selecciona el Color
		this.cmd("SetBackgroundColor", this.nextIndex, Trie.FALSE_COLOR);//tamaño del circulo
		this.cmd("SetWidth", this.nextIndex, Trie.NODE_WIDTH);// Tamaño del nodo raiz
				
		//muestra la letra
		this.root = new TrieNode("", this.nextIndex, Trie.NEW_NODE_X, Trie.NEW_NODE_Y)
				
		this.cmd("Step");//paso	
        this.resizeTree(); //redimencionar
	    this.cmd("SetText", 2, "" ); // ingreso de texto
        this.highlightID = this.nextIndex++;//aumenta las palabras
        this.nextIndex += 1;//siguiente
	        
        }
        this.addR(word.toUpperCase(), this.root);//Mayusculas
		this.cmd("SetText", 0, ""); //mensage
		this.cmd("SetText", 1, ""); //mensage
		this.cmd("SetText", 2, ""); //mensage

        return this.commands;// retorno comando
}


///////////////////////////////////////Trie Insercion/////////////////////////////////////////

Trie.prototype.addR = function(s, tree) // funcion agregar  en el Arbol
{
    this.cmd("SetHighlight", tree.graphicID , 1); //efecto de mostrar el arbol

    if (s.length == 0) // Si la longitud es igual A 0
    {
         
            this.cmd("Step"); // se hace el comando Paso

    	    this.cmd("SetBackgroundColor", tree.graphicID, Trie.TRUE_COLOR);//  traemos el efeto de color y mostramos l arbol
            this.cmd("SetHighlight", tree.graphicID , 0);//efecto en el arbol
	    tree.isword = true;// encuentra la palabra es VERDAD
	    return;//retorna
    }
    else // de lo contrario
    {
       this.cmd("SetHighlightIndex", 1, 1);//establece el resaltado
       var index = s.charCodeAt(0) - "A".charCodeAt(0);//caracteres de letras
       if (tree.children[index] == null)//si es nodos hijos son igual a Null
       {
           this.cmd("CreateCircle", this.nextIndex, s.charAt(0), Trie.NEW_NODE_X, Trie.NEW_NODE_Y); // efecto de circulo, , segura avanzado, el lienzo
		   // efeto de color en Primer Plano
		   this.cmd("SetForegroundColor", this.nextIndex, Trie.FOREGROUND_COLOR);
		   // efecto de color en primer plano si es falso
		   this.cmd("SetBackgroundColor", this.nextIndex, Trie.FALSE_COLOR);
		   // efecto para entablecer ancho desde la raiz 
           this.cmd("SetWidth", this.nextIndex, Trie.NODE_WIDTH);
			//crea nuevo nodo
           tree.children[index] = new TrieNode(s.charAt(0), this.nextIndex, Trie.NEW_NODE_X, Trie.NEW_NODE_Y)
	   tree.children[index].parent = tree;
	   //lla a la funcion de Conectar con una Linea
           this.cmd("Connect", tree.graphicID, tree.children[index].graphicID, Trie.FOREGROUND_COLOR, 0, false, s.charAt(0));

           this.cmd("Step");//	comando paso			
           this.resizeTree();// redimencionar arbol
           this.cmd("SetText", 2, "" );//  montrar mensaje
           this.nextIndex += 1;// se le suma a la NextIdex (+=1)
           this.highlightID = this.nextIndex++; // va ingrementando 

		}
	// se llama a la funcion de efectos de circulo, en espacio del lienzo
 	this.cmd("CreateHighlightCircle", this.highlightID, Trie.HIGHLIGHT_CIRCLE_COLOR, tree.x, tree.y);
        this.cmd("SetWidth", this.highlightID, Trie.NODE_WIDTH);// comando establecer ancho 
      
        this.cmd("Step")// paso
        this.cmd("SetHighlight", tree.graphicID , 0);// establecemos resaltado en el arbol
        this.cmd("SetHighlightIndex", 1, -1);// se establece el indice de resaltado con lo valores
        this.cmd("SetText", 1, "\"" + s.substring(1) + "\"");// se manda lo mensajes 

        this.cmd("Move", this.highlightID, tree.children[index].x, tree.children[index].y);// comando de mover para las seguientes variables
        this.cmd("Step")// paso
 	this.cmd("Delete", this.highlightID);//borrar
	this.addR(s.substring(1), tree.children[index])//agregar
    }
}
/*******************************************************************************/
//mantener nueva posicion
Trie.prototype.setNewPositions = function(tree, xPosition, yPosition) // funcion sobre las posiciones en el lienzo
{
	if (tree != null) // si es arbol es diferente a Null (NADA)
	{
                tree.x = xPosition;  //se adigna tree.x a xposition
		tree.y = yPosition; // se asigna tree.y a y position
                var newX = xPosition - tree.width / 2;  // se declara la variable NewX que se asigna xposition
                var newY = yPosition + Trie.HEIGHT_DELTA; //se declara newY que se asigna Y position
                for (var i = 0; i < 26; i++) //..
                { 
                     if (tree.children[i] != null) // si lo nmodos no estan en Null
                     {
						 //se va acomonado en el Lienso las palabras
						   this.setNewPositions(tree.children[i], newX + tree.children[i].width / 2, newY);
						   newX = newX + tree.children[i].width;
						   // se va creando el arbol y acomonado lo doso Hijos
                     }
                }
	}
	
}

/******************************************************************************/
//animacion posiciones
Trie.prototype.animateNewPositions = function(tree) // funcion Animacion de Posiciones
{
	if (tree != null) // si el arbol no esta vacio
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y); 
                for (var i = 0; i < 26; i++) //..
                { 
                    this.animateNewPositions(tree.children[i]) // se llama a la funcion para animar el movimiento
                }
	}
}



/*******************************************FUNCIONALIDADES************************************************/


Trie.prototype.resizeWidths = function(tree) // redimencionar
{
	if (tree == null)  // si el arbol es igual a Null
	{
		return 0; // no se realiza nada
	}
        var size = 0; // tamaño 0
	for (var i = 0; i < 26; i++)
	{
			//EVITA QUE SE SOBRESCRIBA EN LO NODOS HIJOS
            tree.childWidths[i] = this.resizeWidths(tree.children[i]); // redimencionar el arbol mientras se agrega o elimina
			size += tree.childWidths[i] //tamaño del arbol
	}
		//  ESPACIO DE SEPACION ENTRE LOS NODOS HIJOS
		tree.width = Math.max(size, Trie.NODE_WIDTH  + 4) 
        return tree.width; //retorna el arbol Ancho
}

/****************************************ACEPTACION DE VALORES*****************************************/



function TrieNode(val, id, initialX, initialY) // Nodos del Trie, val , id espacios en el lienzo
{
	this.wordRemainder = val; // 
	this.x = initialX; //inicializa X
	this.y = initialY; // Inicializa Y
	this.graphicID = id;//muestra el Id Grafico
        this.children = new Array(26); // tamaño de chijos 26
        this.childWidths = new Array(26); // ancho de los Nodos hijos 26
        for (var i = 0; i < 26; i++)//..
	{
            this.children[i] = null; //  se le asigna Null a los hiJOS[i]
            this.childWidths[i] =0; // el acho de los nocos se les asigna 0
	}
        this.width = 0; // se declara Anchura
	this.parent = null; // se asigna Null a los parientes
}

/**************************************DISPONIBILIDAD DE LOS BOTONES************************************/

Trie.prototype.disableUI = function(event) // funcion para desabilitar Botones
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
	this.printButton.disabled = true;
}

Trie.prototype.enableUI = function(event) // funcion para habilitar Botonos
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
        this.printButton.disabled = false;
}

/********************************************MOSTRAR ITENS*********************************************/


var currentAlg; //declaramos CurrenteAlgo(presente)

function init() //Inicializacion de Arbol
{
	var animManag = initCanvas(); //animacion lienzo
	currentAlg = new Trie(animManag, canvas.width, canvas.height); // inicializacion de Trie
	
}
