<?php include "includes/board.php";?>
<?php

	$white_piece_color = "#FFFFFF";
	$black_piece_color = "#000000";

?>
<html>
<head>
<title>Chess v0.0.1</title>

<link rel="stylesheet" href="css/default.php" />
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<!-- function definitions -->
<script>

function take_piece(rank, file, the_board, the_pieces, simulate) {

	// find taken piece

		//loop over all the pieces
		for(var key in the_pieces) {

			//check if the current piece is in the correct rank
			if (the_pieces[key]['rank'] == rank) {

				//check if the current piece is in the correct file
				if(the_pieces[key]['file'] == file) {
					
					//we have found our piece - update pieces object to show it as taken
					the_pieces[key].status = 'taken';
					the_pieces[key].rank = 0;
					the_pieces[key].file = 0;

					if(simulate == 0) {

						taken_pieces++;
						//calculate location of taken piece
						taken_row = Math.ceil(taken_pieces / <?=$taken_pool_row_count;?>);
						taken_column = taken_pieces - ((taken_row-1)*<?=$taken_pool_row_count;?>);
						
						taken_left = <?=(4*$left_edge_width)+(8*($space_width+$space_border));?> + ((taken_column-1) * <?=$space_width+$space_border;?>);
						taken_top = <?=$top_edge_width;?> + (taken_row-1) * <?=$space_height+$space_border;?>;


						//move the div off the board
						taken_id = "Piece"+key;
						taken_piece = document.getElementById(taken_id);
						taken_piece.style.left = taken_left;
						taken_piece.style.top = taken_top;
						$("#"+taken_id).draggable('disable');						
					}

				}	

			}
		}

	// update board object to reflect empty square
	the_board[rank][file] = 0;

	return true;
};

function check_pawn(old_rank, new_rank, old_file, new_file, test_board, test_pieces, simulate) {

			//assume invalid move
			var return_value = false;

			//pawns cannot generally move sidesways or diagonally
			if (old_file == new_file)
			{
				//pawns can generally only move 1 square
				if (movement*(new_rank - old_rank) == 1)
				{
					//make sure the new space is empty
					if (test_board[new_rank][new_file] == 1)
					{
						if(simulate == 0) { output_message("&nbsp;Invalid Move. Pawn's attack diagonally."); }
						return_value = false;
					}
					else
					{
						enpassant = 0;
						return_value = true;
					}
				}
				else
				{
					//allow initial 2 square move
					if(movement*(new_rank-old_rank) == 2 && (old_rank == 7 || old_rank == 2))
					{
						//make sure the middle space and the new space are both empty
						if (test_board[new_rank][new_file] == 1 || test_board[new_rank-movement][new_file] == 1)
						{
							if (simulate==0) { output_message("&nbsp;Invalid Move. Pawns can't jump."); }
							return_value = false;
						}
						else
						{
							//set en passant 
							enpassant = piece_id;
							return_value = true;
						}
					}
					else
					{
						if(simulate==0) { output_message("&nbsp;Invalid Move.  Pawn's move one square at a time."); }
						return_value = false;
					}
				}
			}
			else
			{
				//check if we are directly taking a piece
				if(test_board[new_rank][new_file] == 1)
				{
					//alert('you are trying to attack the enemy!');

					//make sure we are only going forward 1 square
					if (movement*(new_rank - old_rank) == 1)
					{
						//make sure we are only going sideways 1 square
						if (Math.abs(new_file-old_file) == 1)
						{
							//reset the en passant flag
							enpassant = 0;

							//a piece is being taken!
							return_value = true;
						}
						else
						{
							return_value = false;
						}
					}
					else
					{
						return_value = false;

					}

				}
				else
				{
					//if we are moving sideways 1 square
					if(Math.abs(new_file - old_file) == 1 && (movement*(new_rank-old_rank)==1)) {

						//find the id for any piece that is in the square immediately in front of our square
						//loop over all the pieces
						for(var key in test_pieces) {

							//check if the current piece is on the next rank
							if (test_pieces[key]['rank'] == (new_rank-movement)) {

								//check if the current piece is in the correct file
								if(test_pieces[key]['file'] == new_file) {

									//check if the en passant flag matches
									if(enpassant == key) {

										//reset enpassant flag
										enpassant = 0;
										
										//remove taken piece
										take_piece(new_rank-movement,new_file, board, pieces, 0);

										//accept the move
										return_value = true;
									}
								}	

							}
						}
					}	
					else
					{
						//Not a valid move
						return_value = false;							
					}
				}
			}
		return return_value;
};


function check_diagonal(old_rank, new_rank, old_file,new_file, test_board) {

	//figure out which way we are moving
	file_movement = -1;
	if(old_file < new_file) {
		file_movement = 1;
	}
	rank_movement = -1;
	if(old_rank < new_rank) {
		rank_movement = 1;
	}

	if(file_movement*(new_file-old_file) != rank_movement*(new_rank-old_rank)) {
		return false;
	}

	current_rank = +old_rank + rank_movement;
	current_file = +old_file + file_movement;

	while(current_file != new_file && current_rank != new_rank) {
		
		if(test_board[current_rank][current_file] == 1) {
			//oops there is a piece in the way
			return false;
		}
		current_rank = current_rank + rank_movement;
		current_file = current_file + file_movement;

	}
	return true;
};


function check_vertical(old_rank, new_rank, old_file,new_file, test_board) {

	//figure out which way we are moving
	movement = -1;
	if(old_rank < new_rank) {
		movement = 1;
	}
	
	if(new_rank == old_rank) {
		//not moving anywhere
		return false;
	}

	if(new_file != old_file) {
		//not vertical
		return false;
	}

	if(new_rank == old_rank + movement) {
		//we are only moving 1 square - so nothing can be in the way
		return true;
	}
	else
	{
		//check if their are any pieces in the way
		current_rank = +old_rank + movement;
		while(current_rank != new_rank) {

			if(test_board[current_rank][old_file] == 1) {
				//oops there is a piece in the way
				return false;
			}
			current_rank = current_rank + movement;
		}
		return true;
	}
};

function check_horizontal(old_rank, new_rank, old_file, new_file, test_board) {

	//figure out which way we are moving
	movement = -1;
	if(old_file < new_file) {
		movement = 1;
	}
	
	if(new_file == old_file) {
		//not moving anywhere
		return false;
	}
	if(new_rank != old_rank) {
		//not horizontal
		return false;
	}

	if(new_file == old_file + movement) {
		//we are only moving 1 square - so nothing can be in the way
		return true;
	}
	else
	{
		//check if their are any pieces in the way
		current_file = +old_file + movement;
		while(current_file != new_file) {

			if(test_board[old_rank][current_file] == 1) {
				//oops there is a piece in the way
				return false;
			}
			current_file = current_file + movement;
		}

		return true;
	}
};

function check_knight(old_rank, new_rank, old_file, new_file) {
	
	if ((Math.abs(old_rank-new_rank) == 2 && Math.abs(old_file-new_file) == 1) || (Math.abs(old_rank-new_rank) == 1 && Math.abs(old_file - new_file) == 2)) {
		return true;
	}
	return false;
};

function check_king(old_rank,new_rank,old_file,new_file) {
	if (Math.abs(old_rank-new_rank) <= 1 && Math.abs(old_file-new_file) <= 1) {
		return true;
	}

	// check for possible castle
	if(old_rank == new_rank && Math.abs(old_file-new_file) == 2) {

		//looks like someone is may be trying to castle - lets check a bit deeper
		if((team == "White" && new_rank == 8) || (team == "Black" && new_rank == 1)) {

			//definitely looks like a castle - but which side
			if(new_file < old_file) {

				// looks like a queen side castle
				switch(team) {

					case "White":
						if(w_queen_side_castle == 1) {
							
							//move rook from original spot to new spot
							rook_piece_id = 3;
							rook_element_id = "Piece"+rook_piece_id;
							new_file = 4;
							castle_left = (<?=$space_width;?>+<?=$space_border;?>)*3+<?=$left_edge_width;?>;
							castle_rook = document.getElementById(rook_element_id);
							castle_rook.style.left = castle_left;
							pieces[rook_piece_id]["file"] = 4;

							//allow the king to move
							return true;

						}
						break;

					case "Black":
						if(b_queen_side_castle == 1) {

							//move rook from original spot to new spot
							rook_piece_id = 19;
							rook_element_id = "Piece"+rook_piece_id;
							new_file = 4;
							castle_left = (<?=$space_width;?>+<?=$space_border;?>)*3+<?=$left_edge_width;?>;
							castle_rook = document.getElementById(rook_element_id);
							castle_rook.style.left = castle_left;
							pieces[rook_piece_id]["file"] = 4;

							//allow the king to move
							return true;

						}
						break;
				}
			}
			else
			{
				// looks like a king side castle
				switch(team) {

					case "White":
						if(w_king_side_castle == 1) {
							//move rook from original spot to new spot
							rook_piece_id = 4;
							rook_element_id = "Piece"+rook_piece_id;
							new_file = 6;
							castle_left = (<?=$space_width;?>+<?=$space_border;?>)*5+<?=$left_edge_width;?>;
							castle_rook = document.getElementById(rook_element_id);
							castle_rook.style.left = castle_left;
							pieces[rook_piece_id]["file"] = 6;

							//allow the king to move
							return true;
						}
						break;

					case "Black":
						if(b_king_side_castle == 1) {

							//move rook from original spot to new spot
							rook_piece_id = 20;
							rook_element_id = "Piece"+rook_piece_id;
							new_file = 6;
							castle_left = (<?=$space_width;?>+<?=$space_border;?>)*5+<?=$left_edge_width;?>;
							castle_rook = document.getElementById(rook_element_id);
							castle_rook.style.left = castle_left;
							pieces[rook_piece_id]["file"] = 6;


							//allow the king to move
							return true;
													}
						break;
				}

			}

		}
	}


	return false;
};

function check_friendly_fire(old_rank, new_rank, old_file, new_file, team) {

		//assume the move is valid
		var return_value = false;

		//loop over all the pieces
		for(var key in pieces) {

			//check if the current piece is in the correct rank
			if (pieces[key]['rank'] == new_rank) {

				//check if the current piece is in the correct file
				if(pieces[key]['file'] == new_file) {
					
					//we have found our piece - check which team it is on
					if(pieces[key]['team'] == team) {
						return_value = true;
					}
				}	
			}
		}
		return return_value;
};

function check_for_check(temp_board, temp_pieces, team) {

	//assume we are not moving into check
	in_check = false;

	//find our king
	for(var this_piece in temp_pieces) {

		//check if this piece is on our team
		if((temp_pieces[this_piece]['team'] == team) && (temp_pieces[this_piece]['description'] == "King")) {
			king_rank = temp_pieces[this_piece]['rank'];
			king_file = temp_pieces[this_piece]['file'];
		} 
	}

	//loop over all pieces
	for(this_piece in temp_pieces) {

		//check if this piece is on the opposing team
		if(temp_pieces[this_piece]['team'] != team) {

			this_piece_rank = temp_pieces[this_piece]['rank'];
			this_piece_file = temp_pieces[this_piece]['file'];
			
			//see if this piece can attack the king
			switch(temp_pieces[this_piece].description)
			{

				case "Pawn":
					// check the proposed pawn movement is valid
					in_check = (check_pawn(this_piece_rank, king_rank, this_piece_file, king_file, temp_board, temp_pieces, 1));
					break;
				case "Rook":
					//check the horizontal or vertical path is valid
					in_check = (check_horizontal(this_piece_rank,king_rank,this_piece_file,king_file, temp_board) || check_vertical(this_piece_rank,king_rank,this_piece_file,king_file, temp_board));
					break;
				case "Bishop":
					//check the diagonal path is clear
					in_check = (check_diagonal(this_piece_rank,king_rank,this_piece_file,king_file, temp_board));
					break;
				case "Queen":
					//check for valid horizontal, diagonal or vertical movement
					in_check = ((check_horizontal(this_piece_rank,king_rank,this_piece_file,king_file, temp_board) || check_vertical(this_piece_rank,king_rank,this_piece_file,king_file, temp_board)) || check_diagonal(this_piece_rank,king_rank,this_piece_file,king_file,temp_board));
					break;
				case "Knight":
					//check the proposed knight's movement is valid
					in_check = (check_knight(this_piece_rank,king_rank, this_piece_file, king_file));
					break;
				case "King":
					//check the proposed king's movement is valid
					in_check = (check_king(this_piece_rank,king_rank,this_piece_file,king_file));
					break;
				default:
					in_check = false;
					break;
			}
		}
		if (in_check == true) {
			return in_check;
		}
	}

	// true = in check; false = not in check
	return in_check;

};

function output_message(message) {
	$("#message_text" ).html(message);
}


function toggle_turn() {

	switch (current_turn) {
		case "White":
			$("#turn_text" ).html("<b>&nbsp;Current Move: </b>Black");
			return "Black";
			break;
		case "Black":
			$("#turn_text").html("<b>&nbsp;Current Move: </b>White");
			return "White";
			break;
	}
}

function check_move(board_space, piece) {

	//returns true if the move is valid; return false if the move is invalid
	var return_value = false;

	//process input arguments
	new_rank = board_space.attr('id').substring(5,6);
	new_file = board_space.attr('id').substring(7,8);
	piece_id = piece.attr('id').substring(5,7);

	//get piece information from pieces object
	piece_type = pieces[piece_id].description;
	team = pieces[piece_id].team;
	old_rank = pieces[piece_id].rank;
	old_file = pieces[piece_id].file;

	//set movement direction
	movement = -1;
	if (team == "Black")
	{ 
		movement = 1;
	}


	//check if it is our turn
	if(team == current_turn) {
		//define validation scripts for each piece type
		switch(piece_type)
		{

			case "Pawn":
				// check the proposed pawn movement is valid
				return_value = (check_pawn(old_rank, new_rank, old_file, new_file, board, pieces, 0));
				break;
			case "Rook":
				//check the horizontal or vertical path is valid
				return_value = (check_horizontal(old_rank,new_rank,old_file,new_file, board) || check_vertical(old_rank,new_rank,old_file,new_file, board));
				break;
			case "Bishop":
				//check the diagonal path is clear
				return_value = (check_diagonal(old_rank,new_rank,old_file,new_file,board));
				break;
			case "Queen":
				//check for valid horizontal, diagonal or vertical movement
				return_value = ((check_horizontal(old_rank,new_rank,old_file,new_file,board) || check_vertical(old_rank,new_rank,old_file,new_file, board)) || check_diagonal(old_rank,new_rank,old_file,new_file, board));
				break;
			case "Knight":
				//check the proposed knight's movement is valid
				return_value = (check_knight(old_rank,new_rank, old_file, new_file));
				break;
			case "King":
				//check the proposed king's movement is valid
				return_value = (check_king(old_rank,new_rank,old_file,new_file));
				break;
			default:
				return_value = false;
				break;
		}

		// check that we are not taking our own piece
		friendly_fire = check_friendly_fire(old_rank,new_rank,old_file,new_file,team);

		//copy board and pieces object (needa new object, not another name for the old one)
		var temp_brd = JSON.parse(JSON.stringify(board));
		var temp_pcs = JSON.parse(JSON.stringify(pieces));

		//make the move in our duplicate game space
		if (temp_brd[new_rank][new_file] == 1 && friendly_fire == false)
		{
			take_piece(new_rank, new_file, temp_brd, temp_pcs, 1);
		}
		//update the temporary pieces and board objects
		temp_pcs[piece_id].rank = new_rank;
		temp_pcs[piece_id].file = new_file;
		temp_brd[old_rank][old_file] = 0;
		temp_brd[new_rank][new_file] = 1;

		check = check_for_check(temp_brd,temp_pcs,team);
		if(check) {
			output_message("&nbsp;Invalid move.  You are currently in Check.</b>");
		}

		if(check || friendly_fire) {
			return_value = false;
		}
		return return_value;		
	}
	return false;
};

</script>



<!-- initialize client side object to store pieces based on server side template -->

<script>

	var pieces = {
    	
		<?php
			$last = count($pieces);
			$current = 0;

  			foreach ($pieces as $this_id=>$this_piece)
  			{
  				$current++;
    			?>
    				<?=$this_id;?> : { description : "<?=$this_piece['description'];?>", rank : "<?=$this_piece['rank'];?>", file : "<?=$this_piece['file'];?>", piece : "<?=$this_piece['piece'];?>", team : "<?=$this_piece['team'];?>", status : "<?=$this_piece['status'];?>" }<?php if ($current < $last) { echo ",";}?>

    			<?php
			}

		?>
	};

	var board = {

		1 : {1 : 1, 2 : 1, 3 : 1, 4 : 1, 5 : 1, 6 : 1, 7 : 1, 8 : 1},
		2 : {1 : 1, 2 : 1, 3 : 1, 4 : 1, 5 : 1, 6 : 1, 7 : 1, 8 : 1},
		3 : {1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0},
		4 : {1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0},
		5 : {1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0},
		6 : {1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0},
		7 : {1 : 1, 2 : 1, 3 : 1, 4 : 1, 5 : 1, 6 : 1, 7 : 1, 8 : 1},
		8 : {1 : 1, 2 : 1, 3 : 1, 4 : 1, 5 : 1, 6 : 1, 7 : 1, 8 : 1}

	};

	var taken_pieces = 0;

	var current_turn = "White";
	var w_queen_side_castle = 1;
	var w_king_side_castle = 1;
	var b_queen_side_castle = 1;
	var b_king_side_castle = 1;

</script>

<!-- End of client side initialization of pieces object -->


<!-- initialize draggable elements (pieces)-->
<script>
  <?php
  	$id = 1;
  	$y1 = $top_edge_width;
	$x1 = $left_edge_width;
	$y2 = ($space_height+$space_border)*(8-1)+$top_edge_width;
	$x2 = ($space_width+$space_border)*(8-1)+$left_edge_width;


  	foreach ($pieces as $this_id=>$this_piece)
  	{
  		$div_id = "Piece".$this_id;
  		?>

  $( function() {
    $( "#<?=$div_id;?>" ).draggable({
    	containment: [<?=$x1;?>,<?=$y1;?>,<?=$x2;?>,<?=$y2;?>],
    	grid: [<?=$space_height+$space_border;?>,<?=$space_width+$space_border;?>],
    	zIndex: 1000,
    	revert: function(board_space)
    	{

	   		//logic to determine whether or not to reject the new position
    		// return TRUE to revert the moove and FALSE to accept it.
    		if (check_move(board_space, this) == true)
    		{
    			output_text = "";

    			//convert input arguments to usefull data
				new_rank = board_space.attr('id').substring(5,6);
				new_file = board_space.attr('id').substring(7,8);
				piece_id = this.attr('id').substring(5,7);
				old_rank = pieces[piece_id].rank;
				old_file = pieces[piece_id].file;

    			//prevent castling if king or rook was moved
    			if(piece_id == 1) {
					var w_queen_side_castle = 0;
					var w_king_side_castle = 0;
					alert("CASTLE FLAG: "+w_king_side_castle);
    			}
    			if(piece_id == 3) {
    				var w_queen_side_castle = 0;
    			}
    			if(piece_id == 4) {
    				var w_king_side_castle = 0;
    			}
    			if(piece_id == 17) {
					var b_queen_side_castle = 0;
					var b_king_side_castle = 0;
    			}
    			if(piece_id == 19) {
    				var b_queen_side_castle = 0;
    			}
    			if(piece_id == 20) {
    				var b_king_side_castle = 0;
    			}

				//check if we are taking a piece
				if (board[new_rank][new_file] == 1)
				{
					take_piece(new_rank, new_file, board, pieces, 0);
					output_text = "PIECE TAKEN!";
				}

				//update the pieces and board objects
				pieces[piece_id].rank = new_rank;
				pieces[piece_id].file = new_file;
				board[old_rank][old_file] = 0;
				board[new_rank][new_file] = 1;

				//accept the move and reset
    			current_turn = toggle_turn();
    			if(check_for_check(board, pieces, current_turn)) {
    				output_message("CHECK!");
    			}
    			else
    			{
    				output_message(output_text);
    			}
    			return false;
    		}
    		else
    		{
    			//reject the move
    			return true;
    		}
    		
    	},
    });
  } );

  		<?php
  	}
  ?>
</script>

<!-- initialize droppable elements (board spaces)-->
<script>
<?php
	$rank = 1;
	$piece_count = sizeof($pieces);
	$piece_id = 0;

	while($rank <= 8)
	{
		$file = 1;
		$piece_id = 0;
		$rank_piece_count = 1;

		while($file<=8)
		{
			$space_id = "Space".$rank."-".$file;
?>
  $( function() {
    $( "#<?=$space_id;?>" ).droppable({
    	//define droppable parameters here
    });
  } );
<?php
			$file++;
		}
		$rank++;
		$rank_pieces = array();
	}
?>
</script>


</head>
<body>

<!-- draw chess board -->
<?php
	$rank = 1;
	$piece_count = sizeof($pieces);
	$piece_id = 0;

	while($rank <= 8)
	{
		$file = 1;
		$piece_id = 0;
		$rank_piece_count = 1;
		#grab all the pieces in this rank
		while($piece_id<=$piece_count)
		{
			if($pieces[$piece_id]['rank']==$rank)
			{
				$rank_pieces[$rank_piece_count]['id'] = $piece_id;
				$rank_pieces[$rank_piece_count]['file'] = $pieces[$piece_id]['file'];
				$rank_pieces[$rank_piece_count]['team'] = $pieces[$piece_id]['team'];
				$rank_piece_count++;
			}
			$piece_id++;
		}

		while($file<=8)
		{
			$space_id = "Space".$rank."-".$file;
			?>
			<div id="<?=$space_id;?>">&nbsp;</div>
			<?php

			if($rank_piece_count > 1)
			{

				foreach($rank_pieces as $this_piece)
				{
					$div_id = "Piece".$this_piece['id'];
					if($this_piece['file']==$file)
					{
						$style = "Color: ".$black_piece_color.";";
						if($this_piece['team'] == "White") {
							$style = "Color: ".$white_piece_color.";";
						}

						?>
						<div id="<?=$div_id;?>" class="ui-widget-content" style="<?=$style;?>"><?=$pieces[$this_piece['id']]['piece'];?></div>
						<?php
					}

				}
			}
			$file++;
		}
		$rank++;
		$rank_pieces = array();
	}
?>
<!-- end of board -->
<div id="turn_text"><b>&nbsp;Current Move: </b>White</div>
<div id="message_text">&nbsp;</div>


</body>
</html>