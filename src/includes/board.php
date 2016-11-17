<?php

	$space_height = 50;
	$space_width = 50;
	$space_border = 2;
	$piece_size = 48;
	$top_edge_width = 25;
	$left_edge_width = 25;
	$taken_pool_row_count = 4;

	$pieces[1]['description'] = "King";
	$pieces[1]['team'] = "White";
	$pieces[1]['rank'] = 8;
	$pieces[1]['file'] = 5;
	$pieces[1]['piece'] = "&#9818;";
	$pieces[1]['status'] = 'active';

	$pieces[2]['description'] = "Queen";
	$pieces[2]['team'] = "White";
	$pieces[2]['rank'] = 8;
	$pieces[2]['file'] = 4;
	$pieces[2]['piece'] = "&#9819;";
	$pieces[2]['status'] = 'active';

	//white queen side rook
	$pieces[3]['description'] = "Rook";
	$pieces[3]['team'] = "White";
	$pieces[3]['rank'] = 8;
	$pieces[3]['file'] = 1;
	$pieces[3]['piece'] = "&#9820;";
	$pieces[3]['status'] = 'active';

	//white king side rook
	$pieces[4]['description'] = "Rook";
	$pieces[4]['team'] = "White";
	$pieces[4]['rank'] = 8;
	$pieces[4]['file'] = 8;
	$pieces[4]['piece'] = "&#9820;";
	$pieces[4]['status'] = 'active';

	$pieces[5]['description'] = "Knight";
	$pieces[5]['team'] = "White";
	$pieces[5]['rank'] = 8;
	$pieces[5]['file'] = 2;
	$pieces[5]['piece'] = "&#9822;";
	$pieces[5]['status'] = 'active';

	$pieces[6]['description'] = "Knight";
	$pieces[6]['team'] = "White";
	$pieces[6]['rank'] = 8;
	$pieces[6]['file'] = 7;
	$pieces[6]['piece'] = "&#9822;";
	$pieces[6]['status'] = 'active';

	$pieces[7]['description'] = "Bishop";
	$pieces[7]['team'] = "White";
	$pieces[7]['rank'] = 8;
	$pieces[7]['file'] = 3;
	$pieces[7]['piece'] = "&#9821;";
	$pieces[7]['status'] = 'active';

	$pieces[8]['description'] = "Bishop";
	$pieces[8]['team'] = "White";
	$pieces[8]['rank'] = 8;
	$pieces[8]['file'] = 6;
	$pieces[8]['piece'] = "&#9821;";
	$pieces[8]['status'] = 'active';

	$pieces[9]['description'] = "Pawn";
	$pieces[9]['team'] = "White";
	$pieces[9]['rank'] = 7;
	$pieces[9]['file'] = 1;
	$pieces[9]['piece'] = "&#9823;";
	$pieces[9]['status'] = 'active';

	$pieces[10]['description'] = "Pawn";
	$pieces[10]['team'] = "White";
	$pieces[10]['rank'] = 7;
	$pieces[10]['file'] = 2;
	$pieces[10]['piece'] = "&#9823;";
	$pieces[10]['status'] = 'active';

	$pieces[11]['description'] = "Pawn";
	$pieces[11]['team'] = "White";
	$pieces[11]['rank'] = 7;
	$pieces[11]['file'] = 3;
	$pieces[11]['piece'] = "&#9823;";
	$pieces[11]['status'] = 'active';

	$pieces[12]['description'] = "Pawn";
	$pieces[12]['team'] = "White";
	$pieces[12]['rank'] = 7;
	$pieces[12]['file'] = 4;
	$pieces[12]['piece'] = "&#9823;";
	$pieces[12]['status'] = 'active';

	$pieces[13]['description'] = "Pawn";
	$pieces[13]['team'] = "White";
	$pieces[13]['rank'] = 7;
	$pieces[13]['file'] = 5;
	$pieces[13]['piece'] = "&#9823;";
	$pieces[13]['status'] = 'active';

	$pieces[14]['description'] = "Pawn";
	$pieces[14]['team'] = "White";
	$pieces[14]['rank'] = 7;
	$pieces[14]['file'] = 6;
	$pieces[14]['piece'] = "&#9823;";
	$pieces[14]['status'] = 'active';

	$pieces[15]['description'] = "Pawn";
	$pieces[15]['team'] = "White";
	$pieces[15]['rank'] = 7;
	$pieces[15]['file'] = 7;
	$pieces[15]['piece'] = "&#9823;";
	$pieces[15]['status'] = 'active';

	$pieces[16]['description'] = "Pawn";
	$pieces[16]['team'] = "White";
	$pieces[16]['rank'] = 7;
	$pieces[16]['file'] = 8;
	$pieces[16]['piece'] = "&#9823;";
	$pieces[16]['status'] = 'active';

	$pieces[17]['description'] = "King";
	$pieces[17]['team'] = "Black";
	$pieces[17]['rank'] = 1;
	$pieces[17]['file'] = 5;
	$pieces[17]['piece'] = "&#9818;";
	$pieces[17]['status'] = 'active';

	$pieces[18]['description'] = "Queen";
	$pieces[18]['team'] = "Black";
	$pieces[18]['rank'] = 1;
	$pieces[18]['file'] = 4;
	$pieces[18]['piece'] = "&#9819;";
	$pieces[18]['status'] = 'active';

	//black queen side rook
	$pieces[19]['description'] = "Rook";
	$pieces[19]['team'] = "Black";
	$pieces[19]['rank'] = 1;
	$pieces[19]['file'] = 1;
	$pieces[19]['piece'] = "&#9820;";
	$pieces[19]['status'] = 'active';

	//black king side rook
	$pieces[20]['description'] = "Rook";
	$pieces[20]['team'] = "Black";
	$pieces[20]['rank'] = 1;
	$pieces[20]['file'] = 8;
	$pieces[20]['piece'] = "&#9820;";
	$pieces[20]['status'] = 'active';

	$pieces[21]['description'] = "Knight";
	$pieces[21]['team'] = "Black";
	$pieces[21]['rank'] = 1;
	$pieces[21]['file'] = 2;
	$pieces[21]['piece'] = "&#9822;";
	$pieces[21]['status'] = 'active';

	$pieces[22]['description'] = "Knight";
	$pieces[22]['team'] = "Black";
	$pieces[22]['rank'] = 1;
	$pieces[22]['file'] = 7;
	$pieces[22]['piece'] = "&#9822;";
	$pieces[22]['status'] = 'active';

	$pieces[23]['description'] = "Bishop";
	$pieces[23]['team'] = "Black";
	$pieces[23]['rank'] = 1;
	$pieces[23]['file'] = 3;
	$pieces[23]['piece'] = "&#9821;";
	$pieces[23]['status'] = 'active';

	$pieces[24]['description'] = "Bishop";
	$pieces[24]['team'] = "Black";
	$pieces[24]['rank'] = 1;
	$pieces[24]['file'] = 6;
	$pieces[24]['piece'] = "&#9821;";
	$pieces[24]['status'] = 'active';

	$pieces[25]['description'] = "Pawn";
	$pieces[25]['team'] = "Black";
	$pieces[25]['rank'] = 2;
	$pieces[25]['file'] = 1;
	$pieces[25]['piece'] = "&#9823;";
	$pieces[25]['status'] = 'active';

	$pieces[26]['description'] = "Pawn";
	$pieces[26]['team'] = "Black";
	$pieces[26]['rank'] = 2;
	$pieces[26]['file'] = 2;
	$pieces[26]['piece'] = "&#9823;";
	$pieces[26]['status'] = 'active';

	$pieces[27]['description'] = "Pawn";
	$pieces[27]['team'] = "Black";
	$pieces[27]['rank'] = 2;
	$pieces[27]['file'] = 3;
	$pieces[27]['piece'] = "&#9823;";
	$pieces[27]['status'] = 'active';

	$pieces[28]['description'] = "Pawn";
	$pieces[28]['team'] = "Black";
	$pieces[28]['rank'] = 2;
	$pieces[28]['file'] = 4;
	$pieces[28]['piece'] = "&#9823;";
	$pieces[28]['status'] = 'active';

	$pieces[29]['description'] = "Pawn";
	$pieces[29]['team'] = "Black";
	$pieces[29]['rank'] = 2;
	$pieces[29]['file'] = 5;
	$pieces[29]['piece'] = "&#9823;";
	$pieces[29]['status'] = 'active';

	$pieces[30]['description'] = "Pawn";
	$pieces[30]['team'] = "Black";
	$pieces[30]['rank'] = 2;
	$pieces[30]['file'] = 6;
	$pieces[30]['piece'] = "&#9823;";
	$pieces[30]['status'] = 'active';

	$pieces[31]['description'] = "Pawn";
	$pieces[31]['team'] = "Black";
	$pieces[31]['rank'] = 2;
	$pieces[31]['file'] = 7;
	$pieces[31]['piece'] = "&#9823;";
	$pieces[31]['status'] = 'active';

	$pieces[32]['description'] = "Pawn";
	$pieces[32]['team'] = "Black";
	$pieces[32]['rank'] = 2;
	$pieces[32]['file'] = 8;
	$pieces[32]['piece'] = "&#9823;";
	$pieces[32]['status'] = 'active';
?>	