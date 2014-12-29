(function() {
	Flotr.addPlugin('latex2js', {
		callbacks: {
			'flotr:beforedraw': function() {
				// var a=this.latex2js.latex2jsfun('\sin ({2x+1} + 1)');
				var a=this.latex2js.latex2jsfun('\sqrt {{x^2} + 1}','x');
				console.log(a(0))
			}
		},
		latex2js: function(expression, needjs) {
			// Simple conversion of LaTeX formulas to Javascript math-expression with at most one variable (x).
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
				[/\\sqrt{([^{}]*)}/ig, 'sqrt($1)'],
				[/\\sqrt\[([0-9]+)\]{([^{}]*)}/ig, '((($2)/(abs($2)))^($1))*((((($2)/(abs($2)))^($1+1))*abs($2))^(1/$1))'],
				[/\\lg\\left\(([^\(\)]+)\\right\)/g, '((log($1))/(log(10)))'],
				[/\\log_(?:{([0-9]+)}|([0-9]))\\left\(([^\(\)]+)\\right\)/g, '((log($3))/(log($1$2)))'],
				[/\\left\|([^\|]*)\\right\|/g, 'abs($1)'],
				[/\\frac{([^{}]*)}{([^{}]*)}/ig, '(($1)/($2))']
			];
			// Some LaTeX-markings need to be replaced only once.
			var reponce = [
				[/\\left\(/ig, '('],
				[/\\right\)/ig, ')'],
				[/\)\(/ig, ')*('],
				[/([0-9])\(/ig, '$1*('],
				[/\^([0-9])/ig, '^($1)'],
				[/\\sin/ig, 'sin'],
				[/\\cos/ig, 'cos'],
				[/\\tan/ig, 'tan'],
				[/\\ln/ig, 'log'],
				[/\\pi/ig, 'Pi'],
				[/([0-9])([a-z])/ig, '$1*$2'],
				[/{/ig, '('],
				[/}/ig, ')'],
				[/,/ig, '.'],
				[/\\cdot/ig, '*'],
				[/e/g, 'Exp(1)'],
				[/([0-9]+)Exp/g, '$1*Exp'],
				[/\)x/g, ')*x'],
				[/\)Pi/g, ')*Pi'],
				[/Pi Exp/g, 'Pi*Exp']
			];
			var oldexpr = '';
			while (oldexpr !== expression) {
				// Replace strings as long as the expression keeps changing.
				oldexpr = expression;
				for (var i = 0; i < latexrep.length; i++) {
					expression = expression.replace(latexrep[i][0], latexrep[i][1]);
				}
			}
			for (var i = 0; i < reponce.length; i++) {
				// Do one-time replacements.
				expression = expression.replace(reponce[i][0], reponce[i][1]);
			}
			var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>\\?:])/ig,
				valid = true;
			expression = expression.replace(reg, function(word) {
				// Check that all math functions / variables that can be found from Javascript's Math-object.
				if (word !== "x" && word !== "Pi" && word !== "Exp" && !Math.hasOwnProperty(word)) {
					valid = false;
				}
				return word;
			});
			if (expression.indexOf('\\') != -1) {
				// If there are still backslashes, there are still some LaTeX  commands that have not been replaced.
				valid = false;
			}
			console.log(expression)
			return !valid ? "INVALID" : expression;
		},
		latexeval: function(expression) {
			// Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
			// and tries to evaluate it to a number.
			expression = '' + expression;
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
					[/\\sqrt{([^{}]*)}/ig, 'sqrt($1)'],
					[/\\lg\\left\(([^\(\)]+)\\right\)/g, '((log($1))/(log(10)))'],
					[/\\frac{([^{}]*)}{([^{}]*)}/ig, '(($1)/($2))'],
					[/\\left\|([^\|]*)\\right\|/g, 'abs($1)'],
					[/((?:[0-9]+)|(?:\([^\(\)]\)))\^((?:[0-9])|(?:{[0-9]+}))/ig, 'pow($1, $2)']
				]
				// Some LaTeX-markings need to be replaced only once.
			var reponce = [
				[/\\sin/ig, 'sin'], // Replace sin
				[/\\cos/ig, 'cos'], // Replace cos
				[/\\tan/ig, 'tan'], // Replace tan
				[/\\ln/ig, 'log'], // Replace ln
				[/\\pi/ig, 'PI'], // Replace PI
				[/\\left\(/ig, '('], // Replace left parenthesis )
				[/\\right\)/ig, ')'], // Replace right parenthesis
				[/(sin|cos|tan)\(([^\^\)]+)\^{\\circ}/ig, '$1($2*PI/180'], // Replace degrees with radians inside sin, cos and tan 
				[/{/ig, '('], // Replace left bracket
				[/}/ig, ')'], // Replace right bracket
				[/,/ig, '.'], // Replace periods with points
				[/\)\(/ig, ')*('], // Add times between ending and starting parenthesis )
				[/\\cdot/ig, '*'], // Replace cdot with times
				[/([0-9]+)PI/ig, '$1*PI'],
				[/e/g, 'E'],
				[/([0-9]+)E/g, '$1*E'],
				[/EPI/g, 'E*PI'],
				[/PI E/g, 'PI*E']
			]
			var oldexpr = '';
			while (oldexpr !== expression) {
				// Replace strings as long as the expression keeps changing.
				oldexpr = expression;
				for (var i = 0; i < latexrep.length; i++) {
					expression = expression.replace(latexrep[i][0], latexrep[i][1]);
				}
			}
			for (var i = 0; i < reponce.length; i++) {
				expression = expression.replace(reponce[i][0], reponce[i][1]);
			}
			var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
				valid = true;
			expression = expression.replace(reg, function(word) {
				if (Math.hasOwnProperty(word)) {
					return 'Math.' + word;
				} else {
					valid = false;
					return word;
				}
			});
			console.log(expression)
			if (!valid) {
				throw 'Invalidexpression';
			} else {
				try {
					return (new Function('return (' + expression + ')'))();
				} catch (err) {
					throw 'Invalidexpression';
				}
			}
		},
		latex2jsfun: function(expression,val) {
			// Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
			// and tries to evaluate it to a number.
			expression = '' + expression;
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
					[/\\sqrt{([^{}]*)}/ig, 'sqrt($1)'],
					[/\\lg\\left\(([^\(\)]+)\\right\)/g, '((log($1))/(log(10)))'],//log解析还有问题
					[/\\frac{([^{}]*)}{([^{}]*)}/ig, '(($1)/($2))'],
					[/\\left\|([^\|]*)\\right\|/g, 'abs($1)'],
					[/((?:[x])|(?:[0-9]+)|(?:\([^\(\)]\)))\^((?:[x])|(?:[0-9])|(?:{[0-9]+}))/ig, 'pow($1,$2)']
				]
				// Some LaTeX-markings need to be replaced only once.
			var reponce = [
				[/\\sin/ig, 'sin'], // Replace sin
				[/\\cos/ig, 'cos'], // Replace cos
				[/\\tan/ig, 'tan'], // Replace tan
				[/\\ln/ig, 'log'], // Replace ln
				[/\\pi/ig, 'PI'], // Replace PI
				[/\\left\(/ig, '('], // Replace left parenthesis )
				[/\\right\)/ig, ')'], // Replace right parenthesis
				[/(sin|cos|tan)\(([^\^\)]+)\^{\\circ}/ig, '$1($2*PI/180'], // Replace degrees with radians inside sin, cos and tan 
				[/{/ig, '('], // Replace left bracket
				[/}/ig, ')'], // Replace right bracket
				// [/,/ig, '.'], // Replace periods with points
				[/x/g,'(x)'],//变量添加括号
				[/([0-9]+)/g,'($1)'],
				[/PI/ig,'(PI)'],
				[/e/g,'(E)'],
				[/\)\(/ig, ')*('], // Add times between ending and starting parenthesis )
				[/\\cdot/ig, '*'], // Replace cdot with times
				// [/([0-9]+)PI/ig, '$1*PI'],
				// [/e/g, 'E'],
				// [/([0-9]+)E/g, '$1*E'],
				// [/\)x/g, ')*x'],
				[/EPI/g, 'E*PI'],
				[/PI E/g, 'PI*E']
			]

			var oldexpr = '';
			while (oldexpr !== expression) {
				// Replace strings as long as the expression keeps changing.
				oldexpr = expression;
				for (var i = 0; i < latexrep.length; i++) {
					expression = expression.replace(latexrep[i][0], latexrep[i][1]);
					console.log(latexrep[i][0],'   ',expression)
				}
			}
			for (var i = 0; i < reponce.length; i++) {
				expression = expression.replace(reponce[i][0], reponce[i][1]);
			}
			var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
				valid = true;
			console.log(expression)
			expression = expression.replace(reg, function(word) {
				console.log(word)
				if(word=='x') return word
				if (Math.hasOwnProperty(word)) {
					return 'Math.' + word;
				} else {
					valid = false;
					return word;
				}
			});
			console.log(expression)
			if (!valid) {
				throw 'Invalidexpression';
			} else {
				try {
					return eval('(function(){return function (x){return '+expression+'}})()');
				} catch (err) {
					console.log(err)
					throw 'Invalidexpression';
				}
			}
		}
	})
})()