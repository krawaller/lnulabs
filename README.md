###David-versioner av LNU-labbar

Några övergripande anteckningar:

*    Jag har inte blandat in någon modulhantering, utan varje labb definierar en objektliteral på the global scope.
*    Alla följer samma mönster; literalen sparar någon sorts state, som dess metoder sedan manipulerar. Detta blir en sorts statiska metoder, jag instansierar aldrig objekt som representerar en liten databit (ett meddelande etc).
*    I memory och labby mezzage så använder jag currying via native bind, ett verktyg som är väldigt tacksamt att ha i sin låda. 