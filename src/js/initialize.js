(function() {

	var game = {
	
		config : {

			top_edge_width : 25,
			left_edge_width : 25,
			space_height : 50,
			space_width : 50,
			space_border_size : 2,
			space_border_color : "#000000",
			space_color : ["#770000","#007700"],
			piece_size : "40px",
			taken_pool_column_count : 4,
			white_piece_color : "#FFFFFF",
			black_piece_color : "#000000"
		},

		lastMovedPiece : 99,  //used for en passant check
		takenPieceCount : 0,
		currentTurn : "White",

		board : [
			[18,20,22,17,16,23,21,19],
			[24,25,26,27,28,29,30,31],
			[99,99,99,99,99,99,99,99],
			[99,99,99,99,99,99,99,99],
			[99,99,99,99,99,99,99,99],
			[99,99,99,99,99,99,99,99],
			[8,9,10,11,12,13,14,15],
			[2,4,6,1,0,7,5,3]
		],

		pieces : [
			{
				//piece_id = 0;
				description : "King",
				team : "White",
				rank : 7,
				file : 4,
				piece : "&#9818;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 1;
				description : "Queen",
				team : "White",
				rank : 7,
				file : 3,
				piece : "&#9819;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 2;
				description : "Rook",
				team : "White",
				rank : 7,
				file : 0,
				piece : "&#9820;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 3;
				description : "Rook",
				team : "White",
				rank : 7,
				file : 7,
				piece : "&#9820;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 4;
				description : "Knight",
				team : "White",
				rank : 7,
				file : 1,
				piece : "&#9822;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 5;
				description : "Knight",
				team : "White",
				rank : 7,
				file : 6,
				piece : "&#9822;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 6;
				description : "Bishop",
				team : "White",
				rank : 7,
				file : 2,
				piece : "&#9821;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 7;
				description : "Bishop",
				team : "White",
				rank : 7,
				file : 5,
				piece : "&#9821;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 8;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 0,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 9;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 1,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 10;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 2,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 11;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 3,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 12;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 4,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 13;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 5,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 14;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 6,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 15;
				description : "Pawn",
				team : "White",
				rank : 6,
				file : 7,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 16;
				description : "King",
				team : "Black",
				rank : 0,
				file : 4,
				piece : "&#9818;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 17;
				description : "Queen",
				team : "Black",
				rank : 0,
				file : 3,
				piece : "&#9819;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 18;
				description : "Rook",
				team : "Black",
				rank : 0,
				file : 0,
				piece : "&#9820;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 19;
				description : "Rook",
				team : "Black",
				rank : 0,
				file : 7,
				piece : "&#9820;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 20;
				description : "Knight",
				team : "Black",
				rank : 0,
				file : 1,
				piece : "&#9822;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 21;
				description : "Knight",
				team : "Black",
				rank : 0,
				file : 6,
				piece : "&#9822;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 22;
				description : "Bishop",
				team : "Black",
				rank : 0,
				file : 2,
				piece : "&#9821;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 23;
				description : "Bishop",
				team : "Black",
				rank : 0,
				file : 5,
				piece : "&#9821;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 24;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 0,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 25;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 1,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 26;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 2,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 27;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 3,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 28;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 4,
				piece : "&#9823;",
				status : "active",
				moved : 0	
			},
			{
				//piece_id = 29;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 5,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 30;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 6,
				piece : "&#9823;",
				status : "active",
				moved : 0
			},
			{
				//piece_id = 31;
				description : "Pawn",
				team : "Black",
				rank : 1,
				file : 7,
				piece : "&#9823;",
				status : "active",
				moved : 0
			}
		] //end pieces list
	} // end game object

	ChessApp.loadGame(game);
})();