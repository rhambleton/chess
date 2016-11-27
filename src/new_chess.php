<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Chess v2.0.0</title>

    <!-- Bootstrap css -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

  </head>
  <body>

    <div id="chess-container">
      <div id="chess-main"></div>
      <div
        id="message_text"
        style = "
          background-Color: #DDDDDD;
          color: #DD0000;
          width: 420px;
          height: 20px;
          margin-left: 0px;
          margin-right: 0px;
          border: 1px;
          border-style: solid;
          border-color: #000000;
          position: absolute;
          top: 490px;
          left: 25px;
          z-index: -5;
          text-align: Center;
      ">
        &nbsp;
      </div>
    </div>


    <script type="text/template" class="boardSpace">
      <div 
        id="<%- space.space_id %>" 
        style="
          background-color: <%- space.bgcolor %>;
          width: <%- space.width %>px;
          height: <%- space.height %>px;
          margin-left: 0px;
          margin-right: 0px;
          padding: 0px;
          border: <%- space.border_size %>px;
          border-style: solid;
          border-color: <%-   space.border_color %>;
          position: absolute;
          top: <%- space.top %>px;
          left: <%- space.left %>px;
          text-align : center;
          z-index: 0;
      "></div>
      <div
        id="<%- space.piece_id %>"
        style="
          position: absolute;
          top: <%- space.top %>px;
          left: <%- space.left %>px;
          width: <%- space.width %>px;
          height: <%- space.height %>px;
          font-size: <%- space.font_size %>;
          color: <%- space.piece_color %>;
          text-align: center;
          z-index: <%- space.piece_zindex %>;
      ">
        <%= space.piece %>
      </div>
    </script>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="js/chess.js"></script>

  </body>
</html>
