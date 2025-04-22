cfg.Light, cfg.MUI, cfg.Portrait;
app.LoadPlugin( "Utils" );
const utils = app.CreateUtils();
var lng = 'eng';//ita';//fre';
var addr = "https://en.wikipedia.org/wiki/Special:Random";//https://it.m.wikipedia.org/wiki/Speciale:PaginaCasuale";//https://fr.m.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard";
var address1  = addr;//"https://en.wikipedia.org/wiki/Special:Random";// "https://fr.m.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard";//https://en.wikipedia.org/wiki/Special:Random";
var address2 = addr;//"https://en.wikipedia.org/wiki/Special:Random";//"https://it.m.wikipedia.org/wiki/Speciale:PaginaCasuale";//https://es.wikipedia.org/wiki/Especial:Aleatoria";
var address3 = addr;//"https://en.wikipedia.org/wiki/Special:Random";
var address4 = addr;//"https://en.wikipedia.org/wiki/Special:Random";//"https://es.wikipedia.org/wiki/Especial:Aleatoria";
var address5  = addr;//"https://en.wikipedia.org/wiki/Special:Random";// "https://fr.m.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard";//https://en.wikipedia.org/wiki/Special:Random";
var address6 = addr;//"https://en.wikipedia.org/wiki/Special:Random";//"https://it.m.wikipedia.org/wiki/Speciale:PaginaCasuale";//https://es.wikipedia.org/wiki/Especial:Aleatoria";
var address7= addr;//"https://en.wikipedia.org/wiki/Special:Random";
var address8 = addr;//"https://en.wikipedia.org/wiki/Special:Random";//"https://es.wikipedia.org/wiki/Especial:Aleatoria";
var adr = ["https://en.wikipedia.org/wiki/Special:Random;eng", "https://it.m.wikipedia.org/wiki/Speciale:PaginaCasuale;ita","https://fr.m.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard;fre","https://es.wikipedia.org/wiki/Especial:Aleatoria;spa"];
var c = 0;
var words = [];

app.Include("Pako.js");
function compressString(input) {
    const binaryString = new TextEncoder().encode(input);
    const compressed = pako.deflate(binaryString);
    return btoa(String.fromCharCode(...compressed)); // Convert to Base64
}

function uncompressString(compressed) {
    const binaryString = Uint8Array.from(atob(compressed), c => c.charCodeAt(0));
    const decompressed = pako.inflate(binaryString);
    return new TextDecoder().decode(decompressed);
}

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
	web3= app.CreateWebView( 1, 0.25 );
	web3.SetOnProgress( Progress3 )
	lay.AddChild( web3 );*/
	/*
	web4 = app.CreateWebView( 1, 0.25 );
	web4.SetOnProgress( Progress4)
	lay.AddChild( web4 );
	*/
	/*
	//Create a text label and add it to layout.
	txt = app.CreateText( "Hello" )
	txt.SetTextSize( 32 )
	lay.AddChild( txt )
	*/
	//Add layout to app.	
	app.AddLayout( lay );
	//app.GetPermission(  )
	if(c==0) SetData();
	//GetWiki();
	//r = setInterval(GetWiki, 875)
	sI = setInterval(GetWiki, 150);
}

function SetData(){

//Create or open a database called "Wikipedia".  
dbPath = "/storage/emulated/0/Download/WikiData4.sqlite";
    db = app.OpenDatabase(  dbPath )  
    if(confirm("Drop tables?")) db.ExecuteSql("DROP TABLE Wiki_Data;");

    //db = app.OpenDatabase( app.GetDatabaseFolder()+ "/WikiData.sqlite" )  
           //app.Exit()
    //Create a table (if it does not exist already).  
    db.ExecuteSql( "CREATE TABLE IF NOT EXISTS Wiki_Data " +  
        "(id integer primary key AUTOINCREMENT, title text unique, url text, textContent text, htmlContent, lang text)" )  
db.ExecuteSql("CREATE VIEW IF NOT EXISTS WikiSort AS SELECT * FROM Wiki_Data Order By title ASC");
app.CopyFile( dbPath, "/storage/emulated/0/WikipediaNew/db/WikiData2.sqlite" );
    
}

function Progress1(progress)
{
	if(progress==100) {
	//web1.Execute( app.ReadFile( "OnWebview.js" ) );
	web1.Execute("[document.title.replace(' - Wikipedia',''), window.location.href, document.getElementsByTagName('HTML')[0].innerText, document.getElementsByTagName('HTML')[0].outerHTML];", ParseData1 );
	}
	//app.ReadFile( app.GetAppPath()+"/OnWeb.js") );
	//"app.ShowPopup(document.title);" );
}

function Progress2(progress)
{
	if(progress==100) {
	//web2.Execute( app.ReadFile( "OnWebview.js" ) );

	web2.Execute("[document.title.replace(' - Wikipedia',''), window.location.href, document.getElementsByTagName('HTML')[0].innerText, document.getElementsByTagName('HTML')[0].outerHTML];", ParseData2 );
	}
}

function Progress3(progress)
{
	if(progress==100) {
//	web3.Execute( app.ReadFile( "OnWebview.js" ) );

	web3.Execute("[document.title.replace(' - Wikipedia',''), window.location.href, document.getElementsByTagName('HTML')[0].innerText, document.getElementsByTagName('HTML')[0].outerHTML];", ParseData3 );
	}
	//app.ReadFile( app.GetAppPath()+"/OnWeb.js") );
	//"app.ShowPopup(document.title);" );
}

function Progress4(progress)
{
	if(progress==100) {
//	web4.Execute( app.ReadFile( "OnWebview.js" ) );

	web4.Execute("[document.title.replace(' - Wikipedia',''), window.location.href, document.getElementsByTagName('HTML')[0].innerText, document.getElementsByTagName('HTML')[0].outerHTML];", ParseData4);
	}
}

function ParseData1(results)
{
	a = results[0].replace(",","").replace("la enciclopedia libre","");
	e = results[1];
	b = results[2];
	d = results[3];
	//app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent,lang)  VALUES (?,?,?,?,?)", [a, e, b,compressString(d),lng1], null, null );
	app.WriteFile( "/storage/emulated/0/WikipediaNew/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/WikipediaNew/text/"+a+".txt", b );
app.ShowPopup( "Record was saved" )
		//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
	c = 1;
}

function ParseData2(results)
{
a = results[0].replace(",","").replace("la enciclopedia libre","");
	e = results[1];
	b = results[2];
	d = results[3];
	//app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent,lang)  VALUES (?,?,?,?,?)", [a, e, b,compressString(d),lng2], null, null );
	app.WriteFile( "/storage/emulated/0/WikipediaNew/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/WikipediaNew/text/"+a+".txt", b );

		//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
	c = 1;
}

function ParseData3(results)
{
	a = results[0].replace(",","").replace("la enciclopedia libre","");
	e = results[1];
	b = results[2];
	d = results[3];
	//app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent,lang)  VALUES (?,?,?,?,?)", [a, e, b,compressString(d),lng], null, null );
	app.WriteFile( "/storage/emulated/0/WikipediaNew/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/WikipediaNew/text/"+a+".txt", b );

		//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
	c = 1;
}


function ParseData4(results)
{
	a = results[0].replace(",","").replace("la enciclopedia libre","");
	e = results[1];
	b = results[2];
	d = results[3];
	//app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent,lang)  VALUES (?,?,?,?,?)", [a, e, b,compressString(d),lng], null, null );
	app.WriteFile( "/storage/emulated/0/WikipediaNew/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/WikipediaNew/text/"+a+".txt", b );

		//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
	c = 1;
}
function GetWiki()
{
address1 = adr[utils.RandomIntegerRange(0,4)].split(";")[0];
lng1 = adr[utils.RandomIntegerRange(0,4)].split(";")[1];
address2 = adr[utils.RandomIntegerRange(0,4)].split(";")[0];
lng2 = adr[utils.RandomIntegerRange(0,4)].split(";")[1];

		app.HttpRequest( "GET", address1, null, null, handleReply1 );
	app.HttpRequest( "GET", address2, null, null, handleReply2 );
	/*app.HttpRequest( "GET", address3, null, null, handleReply3 );
	app.HttpRequest( "GET", address4, null, null, handleReply4);
	app.HttpRequest( "GET", address5, null, null, handleReply5 );
	app.HttpRequest( "GET", address6, null, null, handleReply6);
	app.HttpRequest( "GET", address7, null, null, handleReply7);
	app.HttpRequest( "GET", address8, null, null, handleReply8);
	*/
	
	
	//GetWiki();
}

function handleReply1( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web1.LoadHtml( reply,address1);
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

function handleReply3( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web3.LoadHtml( reply,address3);
    }
}

function handleReply4( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web4.LoadHtml( reply,address4);
    }
}
function handleReply5( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web1.LoadHtml( reply,address5);
    }
}

function handleReply6( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web2.LoadHtml( reply,address6);
    }
}
function handleReply7( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web3.LoadHtml( reply,address7);
    }
}
function handleReply8( error, reply )
{
    if( error ) alert( reply );
    else
    {
        reply = reply.replace("<head>", '<head><script src="ds:/Sys/app.js"></script>');
    		web4.LoadHtml( reply,address8);
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