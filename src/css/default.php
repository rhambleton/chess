
#turn_text{
	background-Color: #DDDDDD;
	width: 420px;
	height: 20px;
	margin-left: 0px;
	margin-right: 0px;
	border: 1px;
	border-style: solid;
	border-color: #000000;
	position: absolute;
	top: 460px;
	left: 25px;
	z-index: -5;
	text-align: Center;
}

#message_text{
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
}


<?php

	include "../includes/board.php";

	$white_space_color = "#770000";
	$black_space_color = "#007700";
	$border_color = "#000000";

	$rank = 1;
	
	while($rank <= 8)
	{
		$file = 1;

		while($file<=8)
		{
			$space_id = "Space".$rank."-".$file;
			
			$top = ($space_height+$space_border)*($rank-1)+$top_edge_width;
			$left = ($space_width+$space_border)*($file-1)+$left_edge_width;
			$color_test = $rank + $file;

			$color = $black_space_color;
			if($color_test % 2 == 0)
			{
				$color = $white_space_color;
			}

				?>#<?=$space_id;?> {
					background-Color: <?=$color;?>;
					width: <?=$space_width;?>px;
					height: <?=$space_height;?>px;
					margin-left: 0px;
					margin-right: 0px;
					padding: 0px;
					border: <?=$space_border;?>px;
					border-style: solid;
					border-color: <?=$border_color;?>;
					position: absolute;
					top: <?=$top;?>px;
					left: <?=$left;?>px;
					z-index: -1;
				}

			<?php
			$file++;
		}
		$rank++;
	}

	foreach($pieces as $this_id => $this_piece)
	{
		$top = ($space_height+$space_border)*($this_piece['rank']-1)+$top_edge_width;
		$left = ($space_width+$space_border)*($this_piece['file']-1)+$left_edge_width;
		$div_id = "Piece".$this_id;

		?>#<?=$div_id;?> {
			width: <?=$space_width;?>px;
			height: <?=$space_height;?>px;
			font-size: <?=$piece_size;?>;
			position: absolute;
			top: <?=$top;?>px;
			left: <?=$left;?>px;
			text-align: center;
			background: rgba(255, 255, 255, 0.0);
			z-index: 1;
		}

	<?php

	}
?>