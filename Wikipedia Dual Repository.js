cfg.Light, cfg.MUI, cfg.Portrait;
var address1  = "https://fr.m.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard";//https://en.wikipedia.org/wiki/Special:Random";
var address2 = "https://it.m.wikipedia.org/wiki/Speciale:PaginaCasuale";//https://es.wikipedia.org/wiki/Especial:Aleatoria";
var address3 = "https://en.wikipedia.org/wiki/Special:Random";
var address4 = "https://es.wikipedia.org/wiki/Especial:Aleatoria";
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

	web1 = app.CreateWebView( 1, 0.25 );
	web1.SetOnProgress( Progress1 )
	lay.AddChild( web1 );
	
	web2 = app.CreateWebView( 1, 0.25 );
	web2.SetOnProgress( Progress2 )
	lay.AddChild( web2 );
	
	web3= app.CreateWebView( 1, 0.25 );
	web3.SetOnProgress( Progress3 )
	lay.AddChild( web3 );
	
	web4 = app.CreateWebView( 1, 0.25 );
	web4.SetOnProgress( Progress4)
	lay.AddChild( web4 );
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
	r = setInterval(GetWiki, 875)
}

function SetData(){

//Create or open a database called "Wikipedia".  
    db = app.OpenDatabase( "/storage/emulated/0/db/WikiCompress.sqlite" )  
      
     //db.ExecuteSql("DROP TABLE Wiki_Data;");
    //Create a table (if it does not exist already).  
    db.ExecuteSql( "CREATE TABLE IF NOT EXISTS Wiki_Data " +  
        "(id integer primary key AUTOINCREMENT, title text, url text, textContent text, lang text)" )  
db.ExecuteSql("CREATE VIEW IF NOT EXISTS WikiSortx AS SELECT * FROM Wiki_Data Order By title ASC");
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
	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, lang)  VALUES (?,?,?,?)", [a, e, b,'fre'], null, null );
	app.WriteFile( "/storage/emulated/0/Wikipedia/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/Wikipedia/text/"+a+".txt", b );

		//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
	c = 1;
}

function ParseData2(results)
{
	//a = results[0];
	a = results[0].replace(",","").replace("la enciclopedia libre","");
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
	//app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
//	db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [a, e, b, d, 'ita'], null, null );
//db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [compressString(a), e, compressString(b), compressString(d),'ita'], null, null );
db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, lang)  VALUES (?,?,?,?)", [a, e, b, 'ita'], null, null );
	
		app.WriteFile( "/storage/emulated/0/Wikipedia/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/Wikipedia/text/"+a+".txt", b );

	
	//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 100 );

		//app.ShowPopup( "The wiki was saved." );
	c = 1;
	//OnStart();
	
}

function ParseData3(results)
{
	a = results[0].replace(",","").replace("la enciclopedia libre","");
	e = results[1];
	b = results[2];
	d = results[3];
//	app.ShowPopup( "Title: " + a + " , Text: " + b + ".\r\n The record was saved." );
	//db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [a, e, b, d,'eng'], null, null );
//db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [compressString(a), e, compressString(b), compressString(d),'eng'], null, null );
db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent,  lang)  VALUES (?,?,?,?)", [a, e, b,'eng'], null, null );
	
		app.WriteFile( "/storage/emulated/0/Wikipedia/html/"+a+".html", compressString(d) );
app.WriteFile( "/storage/emulated/0/Wikipedia/text/"+a+".txt", b );

	
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
	//db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [a, e, b, d,'spa'], null, null );
//db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, htmlContent, lang)  VALUES (?,?,?,?,?)", [compressString(a), e, compressString(b), compressString(d),'spa'], null, null );
db.ExecuteSql( "INSERT INTO Wiki_Data(title, url, textContent, lang)  VALUES (?,?,?,?)", [a, e, b,'spa'], null, null );
	
		app.WriteFile( "/storage/emulated/0/Wikipedia/html/"+a+".html", compressString(d));
app.WriteFile( "/storage/emulated/0/Wikipedia/text/"+a+".txt", b );

	
	//app.ScreenShot( "/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", 70 );
	
	//app.GetThumbnail("/storage/emulated/0/Download/sqlite/Wiki/"+a+".jpg", "/storage/emulated/0/Download/sqlite/Wiki/"+a+".png", 256, 256 );
	c = 1;
}

function GetWiki()
{
	app.HttpRequest( "GET", address1, null, null, handleReply1 );
	app.HttpRequest( "GET", address2, null, null, handleReply2 );
		app.HttpRequest( "GET", address3, null, null, handleReply3 );
	app.HttpRequest( "GET", address4, null, null, handleReply4);
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