//define chess object
var ChessClass = function() {

    //  .initGame = load initial game board/pieces objects from intialize.js
    //  .loadGame = used by initialize.js to load the objects into 'this'
    //  .drawBoard = draws the board based on the current stage of the board and pieces objects
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
    //  .resetSim = revert the simulation game state to match the live game state
    //  .syncSim = force the live game state to match the simulated game state
    //  .simMode = turn simulation mode on/off by redirecting the this.game pointer to either liveGame or simGame
    //  .makeMove = make the move on the currently active game objects
    //  TODO .check_for_check = checks whether a player is in check
    //  .getDirection returns 1 for black, -1 for white - used to represent forward direction


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
                self.resetSim();
    		},
        	error: function () {
        		alert('failure');
    		}
   		});
	}, // end initGame()

	//drop game data into this instance of ChessApp (used by initialize.js)
	this.loadGame = function( data ) {
        this.simGame = data;
        this.liveGame = data;
        this.game = this.liveGame;
	}, // end loadGame()

	//draw the board on the screen
	this.drawBoard = function () {

    	//loop over board ranks
		for(rank in this.game.board) {
			
            //loop over board files
			for(file in this.game.board[rank]) {

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

        this.outputMessage("Ready to Play!");

	}, // end drawBoard()

    this.outputMessage = function (text) {
        
        // load the html to display the summary
        $("#message_text" ).html(text);
    }, 

	//clear the board from the screen
	this.clearBoard = function () {
		$("#chess-main").html("");
	},

    this.clearPiece = function ( piece_id ) {

        //remove the taken piece physically from the board by relocating the <div> element
        this.game.takenPieceCount++;
        
        //calculate location of taken piece
        taken_row = Math.ceil(this.game.takenPieceCount / this.game.config.taken_pool_column_count);
        taken_column = this.game.takenPieceCount - ((taken_row-1)*this.game.config.taken_pool_column_count);
        
        taken_left = (4*this.game.config.left_edge_width)+(8*(this.game.config.space_width+this.game.config.space_border_size)) + ((taken_column-1) * this.game.config.space_width+this.game.config.space_border_size);
        taken_top = this.game.config.top_edge_width + (taken_row-1) * this.game.config.space_height+this.game.config.space_border_size;

        //move the div off the board
        taken_id = "Piece"+piece_id;
        taken_piece = document.getElementById(taken_id);
        taken_piece.style.left = taken_left+"px";
        taken_piece.style.top = taken_top+"px";
        $("#"+taken_id).draggable('disable');
        
    },

	//setup the drag and drop handlers for the board
	this.initBoard = function () {
		
        containtment_left = this.game.config.left_edge_width;
        containment_top = this.game.config.top_edge_width;
        containment_right = (this.game.config.space_width + this.game.config.space_border_size)*(8-1)+this.game.config.left_edge_width
        containment_bottom = (this.game.config.space_height + this.game.config.space_border_size)*(8-1)+this.game.config.top_edge_width;

        //make all the space droppable
        for(this_rank in this.game.board) {
            for(this_file in this.game.board[this_rank]) {

                space_selector = "#space"+this_rank+"-"+this_file;
                $(space_selector).droppable({});

            }
        } // end loop to make all spaces droppable

        //make all the pieces draggable
        for(this_piece in this.game.pieces) {
                
                piece_selector = "#Piece"+this_piece;

                $(piece_selector).draggable({
                    containment: [containtment_left,containment_top,containment_right,containment_bottom],
                    grid: [this.game.config.space_height+this.game.config.space_border_size,this.game.config.space_width+this.game.config.space_border_size],
                    revert: function (boardSpace) {
                        return self.processMove (boardSpace, this);
                    }
                });
                
        } // end loop to make all pieces draggable
    
    }, // end initBoard()

    this.processMove = function (boardSpace, piece) {

        //convert input data to move object
        move = {};
        move.new_rank = boardSpace.attr('id').substring(5,6);
        move.new_file = boardSpace.attr('id').substring(7,8);
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

        //check if the move is valid
        move = this.checkMove(move);
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

        //sync the simBoard and simPieces to the liveBoard and livePieces objects
        this.resetSim();
        //enter simulation mode (use simGame instead of liveGame)
        this.simMode("on");
        //make the move (using the simGame object)
        this.makeMove(move);

        //check whether the player is in check (on the simBoard)
        if(this.check_for_check(move.team)) {
            move.message = "Invalid Move. You cannot move into CHECK.";
            move.invalid = true;
        }

        //if the move is valid, update the liveGame to reflect the move
        if(move.invalid == false) { this.syncSim(); }

        //turn of simMode
        this.simMode("off");

        //if move is valid - update the board and pieces objects
        if(move.invalid == false) {

            //if a piece has been taken - then remove it from the board
            if(move.pieceTaken == true) {
                this.clearPiece(move.takenPiece);
            }

            //track the last moved piece
            this.game.lastMovedPiece = move.piece_id;
        } 

        //reset the simBoard to match the current game state
        this.resetSim();

        //check if we have put the other team in check
        var chkteam = "White";
        if(move.team == "White") {
            chkteam = "Black";
        }
        if(this.check_for_check(chkteam)) {
            move.message = chkteam+" is in CHECK!";
        }
  
        //output appropriate message
        this.outputMessage(move.message);

        //return "false" to confirm move; "true" to reject it
        return move.invalid;

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
        movement = -1;
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
            movement = -1;
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
                    current_rank = +move.old_rank + movement;
                    path_clear = 1;
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
        file_movement = -1;
        if(move.old_file < move.new_file) {
            file_movement = 1;
        }
        rank_movement = -1;
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
            path_clear = 1;
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
                            var castle_left = (this.game.config.space_width+this.game.config.space_border_size)*new_rook_file+this.game.config.left_edge_width;
                            castle_rook = document.getElementById(rook_element_id);
                            castle_rook.style.left = castle_left+"px";
                            this.game.pieces[rook_piece_id].file = new_rook_file;

                            //confirm the valid movement of the king
                            move.message = "Valid Move - Castle.";
                            move.invalid = false;

                        }
                        else
                        {
                            //pieces are in the way
                            move.message = "Invalid Move - there is somethig in the way.";
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

    this.syncSim = function() {

        //copy simGame object into liveGame object
        this.liveGame = JSON.parse(JSON.stringify(this.simGame));
        return true;
    
    } // end of sync_sim()

    this.resetSim = function() {

        //copy liveGame object into simGame object
        this.simGame = JSON.parse(JSON.stringify(this.liveGame));
        return true;
    
    } // end of sync_sim()


    this.simMode = function(mode) {

        switch(mode) {
            case "on" :
                this.game = this.simGame;
                break;

            case "off" :
                this.game = this.liveGame;
                break
        } // end mode switch
    
    } // end simMode()

    this.makeMove = function(move) {

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

    } // end makeMove()



    this.check_for_check = function (team) {

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
                //checking if What is in check, so loop over black pieces
                var start_piece = 17;
                var end_piece = 31;
                var king_id = 0;
                break;
        }

        //loop over all pieces of the other team
        for(current_piece = start_piece; current_piece <= end_piece; current_piece++) {

            //check if this piece can take the king in the test environment
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
            tstmove = this.checkMove(tstmove);

            if(tstmove.invalid == false) {
                return true;
            }

        }

        return false;

    }, // end of check_for_check()


    this.getDirection = function (piece_id) {
        if(this.game.pieces[piece_id].team == "Black") {
            return 1;
        }
        return -1;
    } // end getDirection()

} // end ChessClass()


//instantiate the class and initialize it
var ChessApp = new ChessClass() 
$(document).ready(function() {
	ChessApp.initGame();
});