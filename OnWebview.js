var links = document.getElementsByTagName("a");
s="";
for(l=0;l<links.length;l++){
	s+=links[l].href + "\n";
}
app.WriteFile( "/storage/emulated/0/db/links.txt", s, "Append" );