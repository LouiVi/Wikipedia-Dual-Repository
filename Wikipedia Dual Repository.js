
var address1 = "https://en.wikipedia.org/wiki/Special:Random";
var address2 = "https://es.wikipedia.org/wiki/Especial:Aleatoria";
var c = 0;
var words = [];
//Called when application is started.
function OnStart()
{
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "Linear", "VCenter,FillXY" )

	web1 = app.CreateWebView( 1, 0.5 );
	web1.SetOnProgress( Progress1 )
	lay.AddChild( web1 );
	
	web2 = app.CreateWebView( 1, 0.5 );
	web2.SetOnProgress( Progress2 )
	lay.AddChild( web2 );
	/*
	//Create a text label and add it to layout.
	txt = app.CreateText( "Hello" )
	txt.SetTextSize( 32 )
	lay.AddChild( txt )
	*/
	//Add layout to app.	
	app.AddLayout( lay );
	if(c==0) SetData();
	//GetWiki();
	r = setInterval(GetWiki, 2475);
}

function SetData(){

//Create or open a database called "Wikipedia".  
    db = app.OpenDatabase( "/storage/emulated/0/Download/sqlite/WikipediaMulti.sqlite" )  
      
     //db.ExecuteSql("DROP TABLE Wiki_Data;");
    //Create a table (if it does not exist already).  
    db.ExecuteSql( "CREATE TABLE IF NOT EXISTS Wiki_Data " +  
        "(id integer primary key AUTOINCREMENT, title text, url text, textContent text, htmlContent text, lang text)" )  
db.ExecuteSql("CREATE VIEW IF NOT EXISTS WikiSortx AS SELECT * FROM Wiki_Data Order By title ASC");
}

function Progress1(progress)
{
	if(progress==100) {
	web1.Execute("[document.title.replace(' - Wikipedia',''), window.location.href, document.getElementsByTagName('HTML')[0].innerText, document.getElementsByTagName('HTML')[0].outerHTML];", ParseData1 );
	}
	//app.ReadFile( app.GetAppPath()+"/OnWeb.js") );
	//"app.ShowPopup(document.title);" );
}

function Progress2(progress)
{
	if(progress==100) {
	web2.Execute("[document.title.replace(' - Wikipedia',''), window.location.href, document.getElementsByTagName('HTML')[0].innerText, document.getElementsByTagName('HTML')[0].outerHTML];", ParseData2 );
	}
}
function ParseData1(results)
{
	a = results[0];
	e = results[1];
	b = results[2];
	/*bb = b.split(" ");
	for(z=0;z<bb.length;z++){
		if(!words.includes(bb[z])){
		words.sort();
		 words.push(bb[z]);
		 words.sort();
		 }
		 //words.sort();
	}*/
	//app.WriteFile( "words-spa.txt", words.sort().join("\r\n"),"Write" );
	d = results[3];
	app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [a, e, b, d,'eng'], null, null );
	app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 100 );

		//app.ShowPopup( "The wiki was saved." );
	c = 1;
	//OnStart();
	
}

function ParseData2(results)
{
	a = results[0];
	e = results[1];
	b = results[2];
	/*bb = b.split(" ");
	for(z=0;z<bb.length;z++){
		if(!words.includes(bb[z])){
		words.sort();
		 words.push(bb[z]);
		 words.sort();
		 }
		 //words.sort();
	}*/
	//app.WriteFile( "words-spa.txt", words.sort().join("\r\n"),"Write" );
	d = results[3];
	app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [a, e, b, d, 'spa'], null, null );
	app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 100 );

		//app.ShowPopup( "The wiki was saved." );
	c = 1;
	//OnStart();
	
}


function GetWiki()
{
	app.HttpRequest( "GET", address1, null, null, handleReply1 );
	app.HttpRequest( "GET", address2, null, null, handleReply2 );
	//GetWiki();
}

function handleReply1( error, reply )
{
    if( error ) alert( reply );
    else
    {
    reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		//app.SetClipboardText( reply );
    		web1.LoadHtml( reply,address1);// "https://wikipedia.org" );
    		//web.LoadFailed()
        //var funfact = reply.slice( reply.indexOf("<i>") + 3, reply.indexOf("</i>") );
        //alert( funfact );
        
    }
}

function handleReply2( error, reply )
{
    if( error ) alert( reply );
    else
    {
    reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		//app.SetClipboardText( reply );
    		web2.LoadHtml( reply,address2);// "https://wikipedia.org" );
    		//web.LoadFailed()
        //var funfact = reply.slice( reply.indexOf("<i>") + 3, reply.indexOf("</i>") );
        //alert( funfact );
        
    }
}
/*var address = "http://www.randomfunfacts.com";

app.HttpRequest( "GET", address, null, null, handleReply );

function handleReply( error, reply )
{
    if( error ) alert( reply );
    else
    {
        var funfact = reply.slice( reply.indexOf("<i>") + 3, reply.indexOf("</i>") );
        alert( funfact );
    }
}
*/