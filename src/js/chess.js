//define chess object
var ChessClass = function() {

    //  .initGame = load initial game board/pieces objects from intialize.js
    //  .loadGame = used by initialize.js to load the objects into 'this'
    //  .drawBoard = draws the board based on the current state of the board and pieces objects
    //  .outputMessage = outputs a text based message in the message <div> below the board
    //  .clearBoard = removes all content from within the main chess <div> = clears the display
    //  .clearPiece = remove a taken piece from the board
    //  .initBoard = enables draggable pieces and droppable spaces (uses jquery-ui)
    //  .processMove = called whenever a piece is dropped, verifies validity, displays message, accepts/rejects move
    //  .checkMove = called by processMove - does the hard work to figure out if the move is valid
    //  .check_pawn = checks for valid movement of a pawn
    //  .check_horizontal = checks for valid horizontal movement of a piece
    //  .check_vertical = checks for valid vertical movement of a piece
    //  .check_diagonal = checks for valid diagonal movement of a piece
    //  .check_knight = checks for valid movement of a knight
    //  .check_king = checks for valid movement of a king
    //  .makeMove = accepts a move object and updates the board and pieces object accordingly
    //  .check_for_check = saves the game state, checks whether a player is in check, restores the game state
    //  .check_for_mate = saves the game state, checks whether a player has any valid moves left, restores the game state
    //  .checkmate = end the game and display the winner - provide method to restart
    //  .toggle_turn = toggle the current turn between the two teams and output the corresponding message
    //  .getDirection returns 1 for black, -1 for white - used to represent the forward direction of the current team
    //  .debug = outputs the board object into a table beneath the game - uncomment line in processmove to enable
    //  .promotePawn = promotes a pawn to a queen
    //  .makeAIMove = makes an AI move and updates the game status
    //  .getAIMove = returns the "best" AI move for a given team
    //  .evalAIMove = used by getMove to evaluate each potential move in order to determine the best one


    //output the game board for debug purposes
    this.debug = function () {

        output_html = "<table border='1' cellpadding='1' cellspacing='1' width='300'>";

        for(var i=0; i<8; i++) {

            output_html += "<tr>";

            for(var j=0; j<8; j++) {
                output_html += "<td align='center'>";
                if(this.game.board[i][j] != 99) {
                    output_html += this.game.board[i][j];
                }
                else {
                    output_html += "&nbsp;";
                }
                output_html += "</td>";
            }

            output_html += "</tr>";
        }

        output_html += "</table>";

        $("#debug").html(output_html);

    }, //end of debug()

    this.promotePawn = function (pieceID) {

        this.game.pieces[pieceID].description = "Queen";
        this.game.pieces[pieceID].piece = "&#9819;";

        //update the dsiplay
        var piece_selector = "#Piece"+pieceID;
        $(piece_selector).html(this.game.pieces[pieceID].piece);

    }, // end of promotePawn()

	//load initial game data from external file
  	this.initGame = function () {

  		self = this;
    	$.ajax({
        	url: 'js/initialize.js',
        	dataType: "script",
        	cache: true,
        	success: function () {
        		self.drawBoard();
        		self.initBoard();
    		},
        	error: function () {
        		alert('failure');
    		}
   		});
	}, // end initGame()

	//drop game data into this instance of ChessApp (used by initialize.js)
	this.loadGame = function( data ) {
        this.game = data;
	}, // end loadGame()

	//draw the board on the screen
	this.drawBoard = function () {

        $("#chess-main" ).html("");

    	//loop over board ranks
		for(var rank in this.game.board) {
			
            //loop over board files
			for(var file in this.game.board[rank]) {

			    _.templateSettings.variable = "space";

				//define output variables
	       		var space = {};
        		space.space_id = "space"+rank+"-"+file;
        		space.bgcolor = this.game.config.space_color[Math.abs(((file-(rank%2)) % 2))];
        		space.width = this.game.config.space_width;
        		space.height = this.game.config.space_height;
        		space.border_size = this.game.config.space_border_size;
        		space.border_color = this.game.config.space_border_color;
        		space.top = (space.height+space.border_size)*rank+this.game.config.top_edge_width;
        		space.left = (space.width+space.border_size)*file+this.game.config.left_edge_width;
        		space.font_size = this.game.config.piece_size;

        		//check if there is a piece in this space
        		if (this.game.board[rank][file] != 99) {
        		    
                    space.piece_zindex = 10;
        			//check which color the piece should be
        			switch (this.game.pieces[this.game.board[rank][file]].team) {

        				case "White":
        					space.piece_color = this.game.config.white_piece_color;
	        				break;
    	    			case "Black":
        					space.piece_color = this.game.config.black_piece_color;
        					break;
        			} // end color selection switch statement

					space.piece_id = "Piece"+this.game.board[rank][file];
        			space.piece = this.game.pieces[this.game.board[rank][file]].piece;

        		} // end check for empty space
        		else
				{
	     			space.piece_zindex = 5;
                    space.piece_id = "empty"+rank+file;
                    space.piece = "";
                    space.piece_color = "#000000";
        		}

		        // Grab the HTML of our template tag and pre-compile it.
		        var template = _.template(
		          $( "script.boardSpace" ).html()
		        );

			    // load the html to display the summary
    			$("#chess-main" ).append(template( space ));
			
            } // end loop over each file

		} // end loop over each rank 

        $("#turnMessage").html("<b>&nbsp;Current Move: </b>White");
        this.outputMessage("Ready to Play!");

	}, // end drawBoard()

    this.outputMessage = function (text) {
        
        // load the html to display the summary
        $("#message_text" ).html(text);
    }, // end of outputMessage()

	//clear the board from the screen
	this.clearBoard = function () {
		$("#chess-main").html("");
	}, // end of clearBoard()

    this.clearPiece = function ( piece_id ) {

        //remove the taken piece physically from the board by relocating the <div> element
        this.game.takenPieceCount++;
        
        //calculate location of taken piece
        var taken_row = Math.ceil(this.game.takenPieceCount / this.game.config.taken_pool_column_count);
        var taken_column = this.game.takenPieceCount - ((taken_row-1)*this.game.config.taken_pool_column_count);
        
        var taken_left = (4*this.game.config.left_edge_width)+(8*(this.game.config.space_width+this.game.config.space_border_size)) + ((taken_column-1) * this.game.config.space_width+this.game.config.space_border_size);
        var taken_top = this.game.config.top_edge_width + (taken_row-1) * this.game.config.space_height+this.game.config.space_border_size;

        //move the div off the board
        var taken_id = "Piece"+piece_id;
        var taken_piece = document.getElementById(taken_id);
        taken_piece.style.left = taken_left+"px";
        taken_piece.style.top = taken_top+"px";
        $("#"+taken_id).draggable('disable');
        
    }, // end of clearPiece()

	//setup the drag and drop handlers for the board
	this.initBoard = function () {
		
        var containtment_left = this.game.config.left_edge_width;
        var containment_top = this.game.config.top_edge_width;
        var containment_right = (this.game.config.space_width + this.game.config.space_border_size)*(8-1)+this.game.config.left_edge_width
        var containment_bottom = (this.game.config.space_height + this.game.config.space_border_size)*(8-1)+this.game.config.top_edge_width;

        //make all the space droppable
        for(var this_rank in this.game.board) {
            for(var this_file in this.game.board[this_rank]) {

                var space_selector = "#space"+this_rank+"-"+this_file;
                $(space_selector).droppable({
                    drop: function (event, ui) {
                        self.processMove(event, ui);
                    }
                });
            }
        } // end loop to make all spaces droppable

        //make all the pieces draggable
        for(var this_piece in this.game.pieces) {
                
                var piece_selector = "#Piece"+this_piece;

                $(piece_selector).draggable({
                    containment: [containtment_left,containment_top,containment_right,containment_bottom],
                    grid: [this.game.config.space_height+this.game.config.space_border_size,this.game.config.space_width+this.game.config.space_border_size],
                    revert: true
                });
                
        } // end loop to make all pieces draggable
    
    }, // end initBoard()

    this.processMove = function (event, ui) {

        var boardSpace = event.target;
        var piece = ui.draggable;

        //convert input data to move object
        var move = {};
        move.new_rank = boardSpace.id.substring(5,6);
        move.new_file = boardSpace.id.substring(7,8);
        move.piece_id = piece.attr('id').substring(5,7);

        move.old_rank = this.game.pieces[move.piece_id].rank;
        move.old_file = this.game.pieces[move.piece_id].file;
        move.piece_type = this.game.pieces[move.piece_id].description;
        move.invalid = true;
        move.message = "Invalid Move.";
        move.pieceTaken = false;
        move.takenPiece = 99;
        move.direction = this.getDirection(move.piece_id);
        move.team = this.game.pieces[this.game.board[move.old_rank][move.old_file]].team

        //check if it is our turn
        if(move.team == this.game.currentTurn) {

            // it is our turn - so check if the move is valid
            move = this.checkMove(move);

        } // end of check that it is our turn
        else
        {   
            //it isn't our turn - this move is NOT valid
            move.message = "Invalid Move - It is "+this.game.currentTurn+"'s Turn.";
            move.invalid = true;
        }

        //check if we are physically trying to take a king
        if(this.game.board[move.new_rank][move.new_file] != 99) {
            if(this.game.pieces[this.game.board[move.new_rank][move.new_file]].description == "King") {
                move.invalid = true;
                move.message = "You cannot take the king.";
            }
        }

        //check if a piece has been taken
        if(this.game.board[move.new_rank][move.new_file] != 99 && move.invalid == false) {

            //check if the piece is on our team
            if (this.game.pieces[this.game.board[move.new_rank][move.new_file]].team == move.team) {
                move.invalid = true;
                move.message = "Invalid Move. You cannot take your own piece.";
            }
            else
            {
                move.pieceTaken = true;
                move.takenPiece = this.game.board[move.new_rank][move.new_file];
                move.message = "Piece Taken!";
            }
        }

        //check whether the player is moving into check
        if(this.check_for_check(move)) {
            move.message = "Invalid Move. You cannot move into CHECK.";
            move.invalid = true;
        } // end of check_for_check()

        //if the move is valid then make the move
        if(move.invalid == false) { 

            //make the move
            this.makeMove(move);
  
            //if a piece has been taken - then remove it from the board
            if(move.pieceTaken == true) {
                this.clearPiece(move.takenPiece);
            }

            //track the last moved piece
            this.game.lastMovedPiece = move.piece_id;

            //toggle the move
            this.game.currentTurn = this.toggle_turn();
        } 

        //check for pawn promotion
        if((move.team == "White" && move.new_rank == 0) || (move.team == "Black" && move.new_rank == 7)) {
            this.promotePawn(move.piece_id);
        }

        //check if we have put the other team in check
        var chkteam = "White";
        if(move.team == "White") {
            chkteam = "Black";
        }

        if(this.check_for_check(chkteam)) {
            move.message = chkteam+" is in CHECK!";
        }

        if(this.check_for_mate(chkteam)) {
            $("#turnMessage").html("CHECKMATE! "+move.team+" Wins!");
            move.message = "<button style='position: absolute; top: 5px; left: 120px;' onclick='javascript:location.reload();''>Click Here to Play Again</button>";
            $("#message_text" ).height("40px");
        }
  
        //output appropriate message
        this.outputMessage(move.message);

        //output debug information
        this.debug();

        //move.invalid="false" to confirm move; "true" to reject it
        if (move.invalid == false) {
            piece.draggable( 'option', 'revert', false );
        }
        else
        {
            piece.draggable( 'option', 'revert', true);
            return;
        }

        //make an AI move
        this.makeAIMove();

        return true;

    }, // end of processMove()

    this.checkMove = function (move) {

        //verify the piece is actually being moved
        if(move.old_rank != move.new_rank || move.old_file != move.new_file) {

            //call piece specific checks
            switch(move.piece_type) {

                case "Pawn" :
                    move = this.check_pawn(move);
                    break;

                case "Rook" :

                    if ( move.old_rank == move.new_rank ) { move = this.check_horizontal(move); }
                    else if ( move.old_file == move.new_file ) { move = this.check_vertical(move); }
                    else { 
                        move.invalid = true;
                        move.message = "Invalid Move.";
                    }
                    break;

                case "Knight" :
                    move = this.check_knight(move);
                    break;

                case "Bishop" :
                    move = this.check_diagonal(move);
                    break;

                case "King" :
                    move = this.check_king(move);
                    break;

                case "Queen" :
                    if ( move.old_rank == move.new_rank ) { move = this.check_horizontal(move); }
                    else if ( move.old_file == move.new_file ) { move = this.check_vertical(move); }
                    else { move = this.check_diagonal(move); }
                    break;
                
            } // end of piece specific checks
        }
        else
        {
            //start and end locations are the same - piece is not moving
            move.message = "Invalid Move - Start and End Locations are the Same.";
            move.invalid = true;

        } // end of check that piece is actually moving

        //return move object
        return move;

    }, // end of checkMove()

    this.check_pawn = function (move) {

        //pawns cannot generally move sidesways or diagonally
        if (move.old_file == move.new_file)
        {

            //pawns can generally only move 1 square forward
            if (move.direction*(move.new_rank - move.old_rank) == 1)
            {
                //make sure the new space is empty
                if (this.game.board[move.new_rank][move.new_file] != 99)
                {
                    move.message="Invalid Move. Pawn's attack diagonally.";
                    move.invalid = true;
                }
                else
                {
                    move.message="Valid Move.";
                    move.invalid = false;
                }
            }
            else
            {
                //allow initial 2 square move
                if(move.direction*(move.new_rank-move.old_rank) == 2 && this.game.pieces[move.piece_id].moved == 0)
                {

                    //make sure the middle space and the new space are both empty
                    if (this.game.board[move.new_rank][move.new_file] != 99 || this.game.board[move.new_rank-move.direction][move.new_file] != 99)
                    {
                        move.message = "Invalid Move. Pawns can't jump.";
                        move.invalid = true;
                    }
                    else
                    {
                        move.message = "Initial Pawn Advance.";
                        move.invalid  = false;
                    }
                }
                else
                {
                    move.message = "Invalid Move. That Pawn can't do that.";
                    move.invalid = true;
                }
            }
        } // end of checks for moves within a single file
        else
        {
            //check if we are directly taking a piece
            if(this.game.board[move.new_rank][move.new_file] != 99)
            {
                //make sure we are only going forward 1 square
                if (move.direction*(move.new_rank - move.old_rank) == 1)
                {
                    //make sure we are only going sideways 1 square
                    if (Math.abs(move.new_file-move.old_file) == 1)
                    {
                        //a piece is being taken!
                        move.message = "Piece Taken."
                        move.pieceTaken = true;
                        move.takenPiece = this.game.board[move.new_rank][move.new_file];
                        move.invalid = false;
                    }
                    else
                    {
                        move.message = "Invalid Move.  Pawns do not move like that.";
                        move.invalid = true;
                    }
                }
                else
                {
                    move.message = "Invalid Move.  Pawns do not move like that.";
                    move.invalid = true;
                }
            } // end of checks for a direct attack
            else
            {
                //if we are moving sideways 1 square
                if(Math.abs(move.new_file - move.old_file) == 1 && (move.direction*(move.new_rank-move.old_rank)==1)) {

                    //check if the last moved piece is 1 square ahead of the square we are attacking
                    if(this.game.lastMovedPiece == this.game.board[move.new_rank-move.direction][move.new_file]) {

                        //check if the last moved piece was a pawn
                        if(this.game.pieces[this.game.lastMovedPiece].description == "Pawn") {

                            //check if the last moved piece is on our team or the other team
                            if(this.game.pieces[this.game.lastMovedPiece].team != move.team) {

                                //valid enpassant move
                                move.message = "En Passant!";
                                move.invalid = false;
                                move.pieceTaken = true;
                                move.takenPiece = this.game.lastMovedPiece;
                            }
                            else
                            {
                                move.message = "Invalid Move. You can't take your own Pawn.";
                                move.invalid = true;
                            }
                        }
                        else
                        {
                            move.message = "Invalid Move. That only works on Pawns.";
                            move.invalid = true;
                        }
                    }
                    else
                    {
                        move.message = "Invalid Move.  That pawn has been there too long.";
                        move.invalid = true;
                    }
                }   
            } // end of checks for En Passant.
        } // end all pawn checks

        return move;

    }, //end of check_pawn()

    this.check_horizontal = function (move) {

        //figure out which way we are moving
        var movement = -1;
        if(move.old_file < move.new_file) {
                movement = 1;
        }

        //check that we are moving at least one square
        if(move.new_file == move.old_file) {
            //not moving anywhere
            move.invalid = true;
            move.message = "Invalid Move.";
        }
        else
        {
            //check that we are moving horizontally
            if(move.new_rank != move.old_rank) {
                //not horizontal
                move.invalid = true;
                move.message = "Invalid Move.  Not Horizontal.";
            }
            else
            {
                //check if we are only moving one square
                if(move.new_file == move.old_file + movement) {
                    //we are only moving 1 square - so nothing can be in the way
                    move.invalid = false;
                    move.message = "Valid Move.";
                }
                else
                {
                    //check if their are any pieces in the way
                    current_file = +move.old_file + movement;
                    path_clear = 1;
                    while(current_file != move.new_file) {

                        if(this.game.board[move.old_rank][current_file] != 99) {
                            //oops there is a piece in the way
                            move.invalid = true;
                            move.message = "Invalid Move.  This piece cannot jump.";
                            path_clear = 0;
                        }
                        current_file = current_file + movement;
                    }

                    if (path_clear == 1) {
                        move.invalid = false;
                        move.message = "Valid Move";
                    }
                } // end check that we are moving more than 1 square
            } // end check that we are moving horizontally
        } // end check that we are moving at least 1 square

        return move;
    },  // end of check_horizontal()

        this.check_vertical = function (move) {

            //figure out which way we are moving
            var movement = -1;
            if(move.old_rank < move.new_rank) {
                movement = 1;
            }
            
            if(move.new_rank == move.old_rank) {
                //not moving anywhere
                move.invalid = true;
                move.message = "Invalid Move.";
            }
            else
            {
                if(move.new_file != move.old_file) {
                    //not vertical
                    move.invalid = true;
                    move.message = "Invalid Move.  Try moving vertically.";
                }
                else
                {

                    if(move.new_rank == move.old_rank + movement) {
                        //we are only moving 1 square - so nothing can be in the way
                        move.invalid = false;
                        return move;
                }
                else
                {
                    //check if their are any pieces in the way
                    var current_rank = +move.old_rank + movement;
                    var path_clear = 1;
                    while(current_rank != move.new_rank) {

                        //if we found a piece, mark the move invalid
                        if(this.game.board[current_rank][move.old_file] != 99) {
                            //oops there is a piece in the way
                            move.invalid = true;
                            move.message = "Invalid Move.  This piece cannot jump.";
                            path_clear = 0;
                        }
                        current_rank = current_rank + movement;
                    }

                    //if nothing is in the way, the move is valid
                    if (path_clear == 1) {
                        move.invalid = false;
                        move.message = "Valid Move.";
                    }
                } //end if to check for single square movement
            } // end if to check for movement
        }

        return move;
    }, // end of check_vertical()

    this.check_diagonal = function (move) {

        //figure out which way we are moving
        var file_movement = -1;
        if(move.old_file < move.new_file) {
            file_movement = 1;
        }
        var rank_movement = -1;
        if(move.old_rank < move.new_rank) {
            rank_movement = 1;
        }

        if(file_movement*(move.new_file-move.old_file) != rank_movement*(move.new_rank-move.old_rank)) {
            move.message = "Invalid Move.  Try moving Diagonally.";
            move.invalid = true;
        }
        else
        {
            //check the path is clear
            current_rank = +move.old_rank + rank_movement;
            current_file = +move.old_file + file_movement;
            var path_clear = 1;
            while(current_file != move.new_file && current_rank != move.new_rank) {

                if(this.game.board[current_rank][current_file] != 99) {
                    
                    //oops there is a piece in the way
                    
                    move.message = "Invalid Move.  This piece cannot jump.";
                    move.invalid = true;
                    path_clear = 0;

                }
                current_rank = current_rank + rank_movement;
                current_file = current_file + file_movement;
            } //end loop that checks the path is clear

            if(path_clear == 1) {
                move.message = "Valid Move.";
                move.invalid = false;
            }
        }
        return move;
    }, // end of check_diagonal()

    this.check_knight = function (move) {

        //check for valid movement pattern
        if ((Math.abs(move.old_rank-move.new_rank) == 2 && Math.abs(move.old_file-move.new_file) == 1) || (Math.abs(move.old_rank-move.new_rank) == 1 && Math.abs(move.old_file - move.new_file) == 2)) {
            //check if we are trying to take a piece
            if(this.game.board[move.new_rank][move.new_file] != 99) {
                //check if it our own piece
                if(move.team != this.game.pieces[this.game.board[move.new_rank][move.new_file]].team) {
                    move.message = "Piece Taken!";
                    move.invalid = false;
                    move.pieceTaken = true;
                    move.takenPiece = this.game.board[move.new_rank][move.new_file];
                }
                else
                {
                    move.message = "Invalid Move.  You can't take your own piece.";
                }
            }
            else
            {
                move.message = "Valid Move.";
                move.invalid = false;
            }
        }
        else
        {
            //incorrect movement pattern
            move.message = "Invalid Move.  Knights don't move like that.";
        }
        return move;
    }, // end of check_knight()

    this.check_king = function (move) {

        if (Math.abs(move.old_rank-move.new_rank) <= 1 && Math.abs(move.old_file-move.new_file) <= 1) {

            move.message = "Valid Move.";
            move.invalid = false;

        } //end check for simple move
        else
        {
          
            // check for possible castle
            if(move.old_rank == move.new_rank && Math.abs(move.old_file-move.new_file) == 2) {

                //looks like someone may be trying to castle - lets check a bit deeper
                if((move.team == "White" && move.new_rank == 7) || (move.team == "Black" && move.new_rank == 0)) {

                    //definitely looks like a castle - but which side
                    if(move.new_file < move.old_file) {

                        // looks like a queen side castle
                        //we will need to make sure these files are empty
                        var empty_file_1 = 1;
                        var empty_file_2 = 2;
                        var new_rook_file = 3;
                        var old_rook_file = 0;

                        //set the piece id's for the involved pieces
                        switch(move.team) {

                            case "White":

                                var king_piece_id = 0;
                                var rook_piece_id = 2;
                                break;

                            case "Black":

                                var king_piece_id = 16;
                                var rook_piece_id = 18;
                                break;

                        } // end switch to set the piece id's
                    }
                    else
                    {
                        //looks like a king side castle
                        //we will need to make sure these files are empty
                        var empty_file_1 = 5;
                        var empty_file_2 = 6;
                        var new_rook_file = 5;
                        var old_rook_file = 7;

                        //set the piece id's for the involved pieces
                        switch(move.team) {

                            case "White":

                                var king_piece_id = 0;
                                var rook_piece_id = 3;
                                break;

                            case "Black":

                                var king_piece_id = 16;
                                var rook_piece_id = 19;
                                break;

                        } // end switch to set the piece id's

                    } //end if - check whether king or queen side castle

                    // check if either piece has been moved
                    if (this.game.pieces[king_piece_id].moved == 0 && this.game.pieces[rook_piece_id].moved == 0) {

                        //neither piece has moved - check if the intermediate spaces are empty
                        if(this.game.board[move.new_rank][empty_file_1] == 99 && this.game.board[move.new_rank][empty_file_2] == 99) {

                            //move the rook to the proper position
                            var rook_element_id = "Piece"+rook_piece_id;
                            var new_file = new_rook_file;

                            //update the board and pieces objects
                            this.game.board[move.old_rank][old_rook_file] = 99;
                            this.game.board[move.new_rank][new_rook_file] = +rook_piece_id;
                            this.game.pieces[rook_piece_id].file = new_rook_file;
                            this.game.pieces[rook_piece_id].moved = 1;

                            //if this is NOT a simulation - update the location of the rook in the browser
                            if(this.simulation == false) {
                                var castle_left = (this.game.config.space_width+this.game.config.space_border_size)*new_rook_file+this.game.config.left_edge_width;
                                var castle_rook = document.getElementById(rook_element_id);
                                castle_rook.style.left = castle_left+"px";
                            }

                            //confirm the valid movement of the king
                            move.message = "Valid Move - Castle.";
                            move.invalid = false;

                        }
                        else
                        {
                            //pieces are in the way
                            move.message = "Invalid Move - there is something in the way.";
                            move.invalid = true;

                        } // end check that intermediate spaces are empty

                    }
                    else
                    {
                        // pieces have already moved
                        move.message = "Invalid Move: You cannot castle now.";
                        move.invalid = true;

                    }

                } // end check for proper rank to be a castle

            } // end check for movement within a single rank

        }
        
        return move;

    },  // end of check_king()


    this.makeMove = function(move) {

        console.log("making move");
        console.log(move.old_rank);

        //if move is valid - update the board and pieces objects
        if(move.invalid == false) {

            //if a piece has been taken - then remove it from the board
            if(move.pieceTaken == true) {
                this.game.pieces[move.takenPiece].status = "taken";
                this.game.pieces[move.takenPiece].rank = 8;
                this.game.pieces[move.takenPiece].file = 8;
            }

            //update the board and pieces objects
            this.game.board[move.old_rank][move.old_file] = 99;
            this.game.board[move.new_rank][move.new_file] = +move.piece_id;
            this.game.pieces[move.piece_id].rank = move.new_rank;
            this.game.pieces[move.piece_id].file = move.new_file;
            this.game.pieces[move.piece_id].moved = 1;
        } 

    }, // end makeMove()

    this.check_for_check = function (moveData) {

        //duplicate the gameboard (so we can restore it when we are done checking things)
        var savedGame = JSON.parse(JSON.stringify(this.game));

        if(moveData.team == "White" || moveData.team == "Black") {

            //we have a full blown move object to apply first
            this.makeMove(moveData)
            var team = moveData.team

        }
        else { 

            var team = moveData; 

        }

        var current_piece = 99;

        //figure out which piece to start with
        switch (team) {

            case "Black" :
                //checking if black is in check, so loop over white pieces
                var start_piece = 1
                var end_piece = 15;
                var king_id = 16;
                break;

            case "White" :
                //checking if White is in check, so loop over black pieces
                var start_piece = 17;
                var end_piece = 31;
                var king_id = 0;
                break;
        }

        //loop over all pieces of the other team
        for(current_piece = start_piece; current_piece <= end_piece; current_piece++) {


                if (this.game.pieces[current_piece].status != "taken") {
                //check if this piece can take the king
                //convert input data to move object
                var tstmove = {};
                tstmove.new_rank = this.game.pieces[king_id].rank;
                tstmove.new_file = this.game.pieces[king_id].file;
                tstmove.piece_id = current_piece;

                tstmove.old_rank = this.game.pieces[tstmove.piece_id].rank;
                tstmove.old_file = this.game.pieces[tstmove.piece_id].file;
                tstmove.piece_type = this.game.pieces[tstmove.piece_id].description;

                tstmove.invalid = true;
                tstmove.message = "Invalid Move.";
                tstmove.pieceTaken = false;
                tstmove.takenPiece = 99;
                tstmove.direction = this.getDirection(tstmove.piece_id);
                tstmove.team = this.game.pieces[tstmove.piece_id].team

                //check if the move is valid
                this.simulation = true;
                tstmove = this.checkMove(tstmove);
                this.simulation = false;

                if(tstmove.invalid == false) {

                    //revert the game state and return true
                    this.game = JSON.parse(JSON.stringify(savedGame));
                    return true;
                }


            } // end check that this piece isn't taken
        } // end loop over all pieces

        //no pieces can attack the king - so we are NOT in check

        //revert the game state and return false
        this.game = JSON.parse(JSON.stringify(savedGame));
        return false;

    }, // end of check_for_check()

    this.check_for_mate = function(team) {

        //duplicate the gameboard (so we can restore it when we are done checking things)
        var backupGame = JSON.parse(JSON.stringify(this.game));

        //define piece id range based on team
        switch (team) {

            case "White" :
                //checking if white is in checkmate, so loop over white pieces
                var start_piece = 0
                var end_piece = 15;
                break;

            case "Black" :
                //checking if black is in checkmate, so loop over black pieces
                var start_piece = 16;
                var end_piece = 31;
                break;
        }

        //loop over all pieces of the current team
        for(var current_piece = start_piece; current_piece <= end_piece; current_piece++) {

            if (this.game.pieces[current_piece].status != "taken") {

                //loop over all board spaces
                for(var new_rank = 0; new_rank <= 7; new_rank++) {

                    for(var new_file = 0; new_file <= 7; new_file++) {

                        //build the test move object
                        var testmove = {};
                        testmove.new_rank = new_rank;
                        testmove.new_file = new_file;
                        testmove.piece_id = current_piece;

                        testmove.old_rank = this.game.pieces[testmove.piece_id].rank;
                        testmove.old_file = this.game.pieces[testmove.piece_id].file;
                        testmove.piece_type = this.game.pieces[testmove.piece_id].description;

                        testmove.invalid = true;
                        testmove.message = "Invalid Move.";
                        testmove.pieceTaken = false;
                        testmove.takenPiece = 99;
                        testmove.direction = this.getDirection(testmove.piece_id);
                        testmove.team = this.game.pieces[testmove.piece_id].team;

                        //check if the move is valid
                        this.simulation = true;
                        testmove = this.checkMove(testmove);
                        this.simulation = false;

                        //check if a piece has been taken
                        if(this.game.board[testmove.new_rank][testmove.new_file] != 99 && testmove.invalid == false) {

                            //check if the piece is on our team
                            if (this.game.pieces[this.game.board[testmove.new_rank][testmove.new_file]].team == testmove.team) {
                                testmove.invalid = true;
                                testmove.message = "Invalid Move. You cannot take your own piece.";
                            }
                            else
                            {
                                testmove.pieceTaken = true;
                                testmove.takenPiece = this.game.board[testmove.new_rank][testmove.new_file];
                                testmove.message = "Piece Taken!";
                            }
                        }

                        if(this.check_for_check(testmove)) {
                            testmove.message = "Invalid Move. You cannot move into CHECK.";
                            testmove.invalid = true;
                        } // end of check_for_check()

                        //check if this piece can move to that space
                        if(testmove.invalid == false) {

                            //at least one valid move exists - reset the game board
                            this.game = JSON.parse(JSON.stringify(backupGame));

                            //return false - the team is NOT in checkmate
                            return false;

                        } // end check for a valid move
                    } //end loop over all files
                } //end loop over all ranks
            } // end check that piece is not taken
        } //end loop over all pieces

        // return true - no valid moves found
        return true;

    }, // end of check_for_mate()


    this.checkmate = function(team) {
        this.outputMessage("CHECKMATE!");
    }, // end of checkmate()

    this.toggle_turn = function() {

        switch (this.game.currentTurn) {
            case "White":
                $("#turnMessage" ).html("<b>&nbsp;Current Move: </b>Black");
                return "Black";
                break;
            case "Black":
                $("#turnMessage").html("<b>&nbsp;Current Move: </b>White");
                return "White";
                break;
        }
    }, // end toggle_turn()

    this.getDirection = function (piece_id) {
        if(this.game.pieces[piece_id].team == "Black") {
            return 1;
        }
        return -1;
    }, // end getDirection()

    this.makeAIMove = function () {

        //get the move
        move = this.getAIMove();
        console.log(JSON.stringify(move));
      
        //if the move is valid then make the move
        if(move.invalid == false) { 

            //make the move
            console.log("got an ai move....lets make it.");
            this.makeMove(move);
  
            //if a piece has been taken - then remove it from the board
            if(move.pieceTaken == true) {
                this.clearPiece(move.takenPiece);
            }

            //track the last moved piece
            this.game.lastMovedPiece = move.piece_id;

            //toggle the move
            this.game.currentTurn = this.toggle_turn();
        } 

        //check for pawn promotion
        if((move.team == "White" && move.new_rank == 0) || (move.team == "Black" && move.new_rank == 7)) {
            this.promotePawn(move.piece_id);
        }

        //check if we have put the other team in check
        var chkteam = "White";
        if(move.team == "White") {
            chkteam = "Black";
        }

        if(this.check_for_check(chkteam)) {
            move.message = chkteam+" is in CHECK!";
        }

        if(this.check_for_mate(chkteam)) {
            $("#turnMessage").html("CHECKMATE! "+move.team+" Wins!");
            move.message = "<button style='position: absolute; top: 5px; left: 120px;' onclick='javascript:location.reload();''>Click Here to Play Again</button>";
            $("#message_text" ).height("40px");
        }
  
        //redraw the board to reflect the changes
        this.drawBoard();
        this.initBoard();

        //output appropriate message
        this.outputMessage(move.message);

        //output debug information
        this.debug();


    }, // end of getAIMove()

    this.getAIMove = function () {

        //generate an empty move
        var move = {};
        //alert(this.game.currentTurn);
        //determine the range of pieces to check for valid moves
        switch (this.game.currentTurn) {

            case "White" :
                //it is white's turn so loop over the white pieces looking for moves
                var start_piece = 1
                var end_piece = 15;
                var king_id = 16;
                break;

            case "Black" :
                //it is black's turn so loop over the black pieces looking for moves
                var start_piece = 17;
                var end_piece = 31;
                var king_id = 0;
                break;
        } // end switch to set the range of piece ID numbers

        //loop over all pieces of the current team
        for(current_piece = start_piece; current_piece <= end_piece; current_piece++) {

            console.log("Piece "+current_piece+" Status: "+this.game.pieces[current_piece].status);

            //make sure this piece hasn't already been taken

            if (this.game.pieces[current_piece].status != "taken") {

                for (var i=0; i<=7; i++) {

                    for (var j=0; j<=7; j++) {

                        //build a move object for moving the current piece to the current space on the board
                        move.new_rank = i;
                        move.new_file = j;
                        move.piece_id = current_piece;
                        move.old_rank = this.game.pieces[move.piece_id].rank;            
                        move.old_file = this.game.pieces[move.piece_id].file;
                        move.piece_type = this.game.pieces[move.piece_id].description;
                        move.invalid = true;
                        move.message = "First AI Move.";
                        move.pieceTaken = false;
                        move.takenPiece = 99;
                        move.direction = this.getDirection(move.piece_id);
                        move.team = this.game.pieces[this.game.board[move.old_rank][move.old_file]].team

                        //check if the move is a valid move for the current piece to make
                        move = this.checkMove(move);

                        //check if we are physically trying to take a king
                        if(this.game.board[move.new_rank][move.new_file] != 99) {
                            if(this.game.pieces[this.game.board[move.new_rank][move.new_file]].description == "King") {
                                move.invalid = true;
                                move.message = "You cannot take the king.";
                            }
                        }

                        //check if a piece has been taken
                        if(this.game.board[move.new_rank][move.new_file] != 99 && move.invalid == false) {

                            //check if the piece is on our team
                            if (this.game.pieces[this.game.board[move.new_rank][move.new_file]].team == move.team) {
                                move.invalid = true;
                                move.message = "Invalid Move. You cannot take your own piece.";
                            }
                            else
                            {
                                move.pieceTaken = true;
                                move.takenPiece = this.game.board[move.new_rank][move.new_file];
                                move.message = "Piece Taken!";
                            }
                        }

                        //check whether the player is moving into check
                        if(this.check_for_check(move)) {
                            move.message = "Invalid Move. You cannot move into CHECK.";
                            move.invalid = true;
                        } // end of check_for_check()

                        console.log(move.invalid);

                        //if we have found a valid move then go ahead and return it
                        if (move.invalid == false) {
                            return move;
                        } // end check if the move is truly valid

                    } // end loop over all files
                } // end loop over all ranks

            } // end check that this piece hasn't been taken

        } // end loop over all pieces

        alert("no valid move found");

        return;

    } // end of getMove();

    this.evalAIMove = function() {

        //calculate a score for the given move
            //pieces under attack
            //pieces that are attacking
            //material score for the moving team
            //material score for the opposing team
            //number of valid moves available to the moving team
            //number of valid moves available to the oppposing team
            //number of pieces that are protected
            //number of opposing team pieces that are protected
    }

} // end ChessClass()


//instantiate the class and initialize it
var ChessApp = new ChessClass() 
$(document).ready(function() {
	ChessApp.initGame();
});