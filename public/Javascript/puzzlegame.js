var Puzzle =
{

/* --
-----------------------------------------------
|	PUBLIC FUNCTIONS                          |
----------------------------------------------- */

	//CONFIGURABLE
	'BORDER_WIDTH'	: 1,		//BORDER WIDTH
	'BORDER_COLOR'	: '#000',	//BORDER COLOR
	'SPEED'			: 200,		//TRANSITION SPEED

	draw:function(){
		Puzzle.make(3);
		Puzzle.shuffle();
	},

	//----------------------------------------------
	// MAKE PUZZLE
	// :: sets up puzzle from image
	// :: one parameter for number of rows/cols
	//----------------------------------------------
	/**
	* 	Example (4x4) :
	*	Puzzle.make(4);
	*
	*	Probably better to call on load event
	*	window.addEvent('load', Puzzle.make.pass(4));
	**/
	make: function(how_many)
	{
		if (!$('puzzle') || !$E('img','puzzle'))
		{
			//NO PUZZLE
			alert("Sorry no DIV with id #puzzle, OR it does not have an img tag.");
			return false;
		}

		//MINIMAL ERROR CHECKING
		if(Puzzle.initialized)
		{
			alert('Puzzle ALREADY initialized.');
			return false;
		}

		//STORE HOW MANY COLS/ROWS
		how_many = parseInt(how_many);
		Puzzle.how_many = parseInt(how_many);

		//SET INITIAL EMPTY SQUARE
		Puzzle.empty_x = Puzzle.how_many-1;
		Puzzle.empty_y = Puzzle.how_many-1;

		//GRAB IMAGE FROM PUZZLE DIV
		var puzzle_image   = $E('img','puzzle');

		//MAKE PUZZLE DIV SAME HEIGHT+WIDTH
		$('puzzle').setStyles({
		   width:  puzzle_image.width + 'px',
		   height: puzzle_image.height + 'px',
		   overflow: 'hidden'
		});

		//CALCULATE HEIGHT/WIDTH of puzzle pieces
		Puzzle.width  = Math.round((puzzle_image.width - ((Puzzle.how_many+1) * Puzzle.BORDER_WIDTH)) / how_many);
		Puzzle.height = Math.round((puzzle_image.height - ((Puzzle.how_many+1) * Puzzle.BORDER_WIDTH)) / how_many);

		//RESET SOLUTION STRING
		Puzzle.solution = '';
		Puzzle.counter  = 0;

		//LET's CREATE
		var p_num = 0;
		Puzzle.piece_arr = new Array();
		for(var x=0; x<how_many; x++)
		{
			for(var y=0; y<how_many; y++)
			{
				//ADD PIECES EXCEPT FOR LAST SLOT
				if(!((y == (how_many-1)) && (x == (how_many-1))))
				{
					//ADD TO SOLUTION STRING
					Puzzle.solution += ''+x+y;

					//ADJUST BACKGROUND POSITION IN EACH PIECE
					var b_x = (Puzzle.width	 + Puzzle.BORDER_WIDTH) * y * -1;
					var b_y = (Puzzle.height + Puzzle.BORDER_WIDTH) * x * -1;

					//CREATE PIECE
					var puzzle_piece = new Element('div');

					puzzle_piece.setStyles({
					   border: Puzzle.BORDER_WIDTH+'px dashed '+Puzzle.BORDER_COLOR,
					   'background-image': 'url('+puzzle_image.src+')',
					   'background-position': b_x +'px ' +b_y+ 'px',
					   'overflow': 'hidden',
					   'position':	'absolute',
					   'width':	 Puzzle.width + 'px',
					   'margin-left':  (b_x*-1) + 'px',
					   'margin-top':  (b_y*-1) + 'px',
					   'height': Puzzle.height + 'px'
					});

					//MAKE CLICKABLE WITH A HREF
					var puzzle_href	 = new Element('a');
					puzzle_href.appendText('');
					puzzle_href.setStyles({
					   'display': 'block',
					   'width':	 Puzzle.width + 'px',
					   'height': Puzzle.height + 'px'
					});
					puzzle_href.setProperty('href','#');
					puzzle_href.onclick = function(){
					   Puzzle.move(this);
					   return false;

					};

					//ADD HREF TO PUZZLE PIECE
					puzzle_href.injectInside(puzzle_piece);

					//STORE X AND Y on PIECE

					puzzle_piece.setProperty('p_num',p_num);
					puzzle_piece.setProperty('p_x',x);
					puzzle_piece.setProperty('p_y',y);


					//ADD TO PUZZLE CONTAINER
					puzzle_piece.injectAfter($('puzzle').getLast());
				}

				Puzzle.piece_arr.push(p_num);
				p_num++;
			}

		}

		//SET FLAG
		Puzzle.initialized  = true;

		//REMOVE ORIGINAL IMAGE
		puzzle_image.remove();
		return false;
	},


	//----------------------------------------------
	// SHUFFLES PUZZLE
	// :: Puzzle needs to be initialized first
	//----------------------------------------------
	/**
	* 	Example:
	*	Puzzle.shuffle();
	**/
	shuffle: function()
	{
		//MINIMAL ERROR CHECKING
		if(!Puzzle.initialized)
		{
			alert('Puzzle not initialized');
			return false;
		}

		Puzzle.counter = 0;
		this.auto_move(true);
		return false;
	},


	//----------------------------------------------
	// FIXES PUZZLE
	// :: Puzzle needs to be initialized first
	//----------------------------------------------
	/**
	* 	Example:
	*	Puzzle.fix();
	**/
	fix: function()
	{
		//MINIMAL ERROR CHECKING
		if(!Puzzle.initialized)
		{
			alert('Puzzle not initialized');
			return false;
		}
		Puzzle.counter = 0;
		this.auto_move(false);
		return false;
	},

	//----------------------------------------------
	// FIXES PUZZLE
	// :: Puzzle does NOT needs to be initialized first
	//----------------------------------------------
	/**
	* 	Example:
	*	Puzzle.switch_image('i/xyz.gif');
	**/
	switch_image: function(imageSrc)
	{
		this.preload = new Image();

		if(Puzzle.initialized)
		{
			//if puzzle initialized then switch backgrounds
			this.preload.onload = this.do_switch_puzzle_image.bind(this);
		}
		else
		{
			//if not just switch image
			this.preload.onload = this.do_switch_image.bind(this);
		}
		this.preload.src = imageSrc;
		return false;
	},


	//----------------------------------------------
	// CHECK PUZZLE
	// :: Puzzle needs to be initialized first
	// :: This is auto called in the (move: function)
	// :: - comment out if desired
	//----------------------------------------------
	/**
	* 	Example:
	*	Puzzle.check();
	**/
	check: function()
	{
		var finished;
		//CREATE CURRENT STRING OF PIECES POSITIONS
		var div_string	= '';
		$$('#puzzle div').each(function(el){
			div_string += ''+el.getProperty('p_x')+el.getProperty('p_y');
		});

		if(div_string==Puzzle.solution)
		{
			//SUCCESFUL
			alert('Solved in ' + Puzzle.counter + ' tries.');
			finished=1;
		}
		return finished;
	},

	TQ1_check: function(){
		var checkAns = $('#submitAns1').val();
		/*checkAns = document.getElementById('submitAns').value;*/
		if(parseInt(checkAns) === 53) {
			alert("맞았습니다!");
		} else {
			alert("틀림");
		}
		//input text 값 초기화
		$('#submitAns1').val(null);
	},

	TQ2_check: function(){
		var checkAns = $('#submitAns2').val();
		/*checkAns = document.getElementById('submitAns').value;*/
		if(parseInt(checkAns) === 9) {
			alert("맞았습니다!");
		} else {
			alert("틀림");
		}
		//input text 값 초기화
		$('#submitAns2').val(null);
	},

	TQ3_check: function(){
		var checkAns = $('#submitAns3').val();
		/*checkAns = document.getElementById('submitAns').value;*/
		if(parseInt(checkAns) === 10) {
			alert("맞았습니다!");
		} else {
			alert("틀림");
		}
		//input text 값 초기화
		$('#submitAns3').val(null);
	},

	TQ4_check: function(){
		var checkAns = $('#submitAns4').val();
		/*checkAns = document.getElementById('submitAns').value;*/
		if(parseInt(checkAns) === 57) {
			alert("맞았습니다!");
		} else {
			alert("틀림");
		}
		//input text 값 초기화
		$('#submitAns5').val(null);
	},

	TQ5_check: function(){
		var checkAns = $('#submitAns5').val();
		/*checkAns = document.getElementById('submitAns').value;*/
		if(parseInt(checkAns) === 1) {
			alert("맞았습니다!");
		} else {
			alert("틀림");
		}
		//input text 값 초기화
		$('#submitAns5').val(null);
	},


/* --
-----------------------------------------------
|	PRIVATE FUNCTIONS   (don't call directly)  |
----------------------------------------------- */

	//DON'T TOUCH
	'how_many'		: 4,	//rows
	'counter'		: 0,	//number of tries
	'empty_x'		: 3,	//empty x slot
	'empty_y'		: 3,	//empty y slot
	'width'			: 3,	//width of PIECE
	'height'		: 3,	//height of PIECE
	'solution'		: '',	//solution string
	'initialized'	: false,	//initialized
	'piece_arr'	: new Array(),	//solution string


	//----------------------------------------------
	// MOVES PIECE
	//----------------------------------------------
	move: function(this_piece_a)
	{
		//GET PUZZLE PIECE
		var this_piece = this_piece_a.getParent();

		//GET PUZZLE CURRENT X and Y
		var piece_x = this_piece.getProperty('p_x').toInt();
		var piece_y = this_piece.getProperty('p_y').toInt();

		var valid_piece = false;
		var is_row		= false;
		var is_col		= false;
		if((piece_x == Puzzle.empty_x) && ((piece_y == (Puzzle.empty_y-1)) || (piece_y == (Puzzle.empty_y+1))))
		{
			//PIECE IS SAME ROW AS EMPTY SLOT
			valid_piece = true;
			is_row		= true;
		}
		else if((piece_y == Puzzle.empty_y) && ((piece_x == (Puzzle.empty_x -1)) ||(piece_x == (Puzzle.empty_x +1))))
		{
			//PIECE IS SAME COLUMN AS EMPTY SLOT
			valid_piece = true;
			is_col		= true;
		}

		if(valid_piece)
		{
			Puzzle.counter++;

			//GET BEGIN MARGIN
			var previous_margin = (is_row) ? this_piece.getStyle('margin-left').toInt() : this_piece.getStyle('margin-top').toInt();

			//GET NEW MARGIN
			var new_margin		= (is_row) ? (Puzzle.width	 + Puzzle.BORDER_WIDTH) * Puzzle.empty_y : (Puzzle.height + Puzzle.BORDER_WIDTH) * Puzzle.empty_x;

			//CREATE NEW SLIDER + MOVE
			var s_margin = (is_row) ? new Fx.Style(this_piece, 'margin-left', {duration:Puzzle.SPEED}) : new Fx.Style(this_piece, 'margin-top', {duration:Puzzle.SPEED});
			s_margin.start(previous_margin,new_margin);

			//SET NEW Y OR X
			if(is_row)
			{
				this_piece.setProperty('p_y',Puzzle.empty_y);
			}
			else
			{
				this_piece.setProperty('p_x',Puzzle.empty_x);
			}

			//SET NEW EMPTY SLOT
			Puzzle.empty_x = piece_x;
			Puzzle.empty_y = piece_y;

			//CHECK SOLUTION (comment out if needed)
			this.check();
		}

	},

	//----------------------------------------------
	// AUTO MOVES PIECE  (from fix or shuffle)
	//----------------------------------------------
	auto_move: function(do_shuffle)
	{
		var tmp = Puzzle.piece_arr.copy();

		//LETS SHUFFLE IF WE ARE SHUFFLING
		if(do_shuffle)
		{
			tmp.shuffle();
		}

		var pause_factor = 0;
		var index_pos 	 = 0;

		$$('#puzzle div').each(function(el)
		{
			var p_num = tmp[index_pos];//el.getProperty('p_num').toInt();

			var x = Math.floor(p_num/Puzzle.how_many);
			var y = Math.floor(p_num%Puzzle.how_many);
			var b_x = (Puzzle.width	 + Puzzle.BORDER_WIDTH) * y;
			var b_y = (Puzzle.height + Puzzle.BORDER_WIDTH) * x;
			var l_margin = el.getStyle('margin-left').toInt();
			var t_margin = el.getStyle('margin-top').toInt();

			if((b_x != l_margin) || (b_y != t_margin))
			{

				var s_l_margin = new Fx.Style(el, 'margin-left', {duration:Puzzle.SPEED});
				var s_t_margin = new Fx.Style(el, 'margin-top', {duration:Puzzle.SPEED});

				el.setProperty('p_x',x);
				el.setProperty('p_y',y);

				s_l_margin.start.pass([l_margin,b_x],s_l_margin).delay(100*pause_factor);
				s_t_margin.start.pass([t_margin,b_y],s_t_margin).delay(100*pause_factor);
				pause_factor++;
			}
			index_pos++

		});


		var p_num = tmp[index_pos];

		//SET INITIAL EMPTY SQUARE
		Puzzle.empty_x = Math.floor(p_num/Puzzle.how_many);
		Puzzle.empty_y = Math.floor(p_num%Puzzle.how_many);

		return false;
	},

	//----------------------------------------------
	// SWITCH IMAGE INTO IMAGE TAG
	//----------------------------------------------
	do_switch_image: function(){

		if (!$('puzzle') && !$E('img','puzzle'))
		{
			//NO PUZZLE
			alert("Sorry no DIV with id #puzzle, OR it does not have an img tag.");
			return false;
		}

		//GRAB REFERENCE
		var puzzle_image   = $E('img','puzzle');

		//CHANGE IMAGE + DIMENSIONS
		puzzle_image.src = this.preload.src;
		puzzle_image.setProperty('height',this.preload.src.height);
		puzzle_image.setProperty('width',this.preload.src.width);

		return false;
	},

	//----------------------------------------------
	// SWITCH IMAGE INTO PUZZLE PIECES
	//----------------------------------------------
	do_switch_puzzle_image: function(){

		//image has changed
		var new_src = this.preload.src;

		//MAKE PUZZLE DIV SAME HEIGHT+WIDTH
		$('puzzle').setStyles({
		   width:  this.preload.width + 'px',
		   height: this.preload.height + 'px'
		});

		//CALCULATE NEW HEIGHT/WIDTH of puzzle pieces
		Puzzle.width  = Math.round((this.preload.width - (Puzzle.how_many * Puzzle.BORDER_WIDTH)) / Puzzle.how_many);
		Puzzle.height = Math.round((this.preload.height - (Puzzle.how_many * Puzzle.BORDER_WIDTH)) / Puzzle.how_many);

		var p = 0;

		$$('#puzzle div').each(function(el)
		{
			//new background position
			var x = Math.floor(p/Puzzle.how_many);
			var y = Math.floor(p%Puzzle.how_many);
			var b_x = (Puzzle.width	 + Puzzle.BORDER_WIDTH) * y * -1;
			var b_y = (Puzzle.height + Puzzle.BORDER_WIDTH) * x * -1;

			el.setStyles({
			   'background-image': 'url('+new_src+')',
			   'width':	 Puzzle.width + 'px',
			   'height': Puzzle.height + 'px',
				'background-position': b_x +'px ' +b_y+ 'px'
			});

			p++;

		});

		//SHOW IN CORRECT ORDER
		this.fix();
	}


};

/** prototype **/
Array.prototype.shuffle = function (){
        for(var rnd, tmp, i=this.length; i; rnd=parseInt(Math.random()*i), tmp=this[--i], this[i]=this[rnd], this[rnd]=tmp);
};