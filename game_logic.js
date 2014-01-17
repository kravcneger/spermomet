/**
 * author Ivan Kravtsov
 */

function Field(columns, rows) {
	var self = this;

	var spermomet_x = Math.floor(columns / 2);
	this.cells = getArray(columns, rows);

	this.nextRow = function() {
		self.cells.reduce(function(previousStr, currentItem, i) {
			if (i != 0) {
				self.cells[i]  = previousStr.filter(function(e){return e !==1; });
				return currentItem;
			}
			return previousStr;
		}, this.cells[0]);
		this.cells[0] = getMultiplicity(rows);
		buildSpermomet();
	};

	// Совершает смещение корабля на плоскости
	this.offsetSpermomet = function(direction) {
		if ((spermomet_x + direction) < 1
				|| (spermomet_x + direction) >= columns - 1) {
			return;
		}
		buildSpermomet(direction);
	};

	this.countColumns = function() {
		return columns;
	};

	this.countRows = function() {
		return rows;
	};
 
	// Задёт клетки на плоскоти корабля
	function buildSpermomet(direction) {		
		if( typeof direction != "undefined" ){
			clearSpermomet();
			spermomet_x += direction;
		}
		check(spermomet_x);	

		self.cells[rows - 3][spermomet_x] = 1;
		self.cells[rows - 2][spermomet_x] = 1;
		self.cells[rows - 1][spermomet_x - 1] = 1;
		self.cells[rows - 1][spermomet_x + 1] = 1;
	}
    
	// Проверяет игру
	function check(position){
		if ([ self.cells[rows - 3][position],
				self.cells[rows - 2][position],
				self.cells[rows - 1][position - 1],
				self.cells[rows - 1][position + 1] ].some(function(e) {
			return e === true;
		})) {
			gameOver();
		}		
	}
	
	// Удаляет старое положение корабля
	function clearSpermomet() {
		self.cells[rows - 3][spermomet_x] = false;
		self.cells[rows - 2][spermomet_x] = false;
		self.cells[rows - 1][spermomet_x - 1] = false;
		self.cells[rows - 1][spermomet_x + 1] = false;
	}

	// Генерирует двухмерный массив с пустыми клетками (false)
	function getArray(columns, rows) {
		var ar = [];

		for (var i = 0; i < rows; i++) {
			ar[i] = [];
			for (var j = 0; j < columns; j++) {
				ar[i][j] = false;
			}
		}
		return ar;
	}

	// Генерирует случайный ряд
	function getMultiplicity(length) {
		var ar = new Array(length);
		while (length > 0) {
			ar[length - 1] = !Math.floor(Math.random() + 0.5);
			length--;
		}
		return ar;
	}
};

function Spermomet(x, y) {
	this.x = x;
	this.y = y;

	this.shoot = function() {

	};

	this.shoot2 = function() {

	};

	this.motion = function() {

	};
}

function Place(element, field, edge) {
	this.w = field.countColumns();
	this.h = field.countRows();
	this.edge = edge;
	this.getContext = function() {
		return element.getContext("2d");
	};
}

function Drawing(place, context, field) {

	this.updateField = function(field) {
		this.field = field;
	};

	this.updateSpermomet = function(spermomet) {
		this.spermomet = spermomet;
	};

	this.render = function() {
		field.cells.forEach(function(row, i, arr1) {
			row.forEach(function(node, j, arr2) {
				if (node === true) {
					renderCell(i, j);
				} else if (node === false) {
					clearCell(i, j);
				} else if (node === 1) {
					spaceship(i, j);
				}
			});
		});
	};

	// Рисует закрашенную клетку
	function renderCell(row, column) {
		context.fillStyle = "rgb(119,136,153)";
		context.fillRect(column * place.edge + 1, row * place.edge + 1,
				place.edge - 2, place.edge - 2);
	}

	// Клетка коробля
	function spaceship(row, column) {
		context.fillStyle = "rgb(200,0,0)";
		context.fillRect(column * place.edge + 1, row * place.edge + 1,
				place.edge - 2, place.edge - 2);
	}

	// Пустая клетка
	function clearCell(row, column) {
		context.fillStyle = "rgb(119,136,153)";
		context.fillRect(column * place.edge + 1, row * place.edge + 1,
				place.edge - 2, place.edge - 2);
		context.clearRect(column * place.edge + 2, row * place.edge + 2,
				place.edge - 4, place.edge - 4);
	}
}

function Game() {

}

Game.Timers = [];

Game.startGame = function() {
	var field = new Field(20, 20);
	var place = new Place(document.getElementById("place"), field, 30);
	var context = place.getContext("2d");
	var drawing = new Drawing(place, context, field);

	Game.Timers.push(setInterval(function() {
		field.nextRow();
	}, 400));
	Game.Timers.push(setInterval(function() {
		drawing.render();
	}, 20));

	document.onkeydown = function(e) {
		e = e || window.event;
		if (e.keyCode == '37') {
			field.offsetSpermomet(-1);
		} else if (e.keyCode == '39') {
			field.offsetSpermomet(1);
		}
	};

};

// Удаляет все таймеры
Game.stopGame = function() {
	for (var i = 0; i < Game.Timers.length; i++) {
		clearInterval(Game.Timers[i]);
	}
};

function gameOver(){
	Game.stopGame();
	alert('Game Over');
}
