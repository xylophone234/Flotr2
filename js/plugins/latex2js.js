(function() {
	Flotr.addPlugin('latex2js', {
		callbacks: {},
		mathParams: {},
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
		/**
		 * bugs
		 * $\left(-3\right)^2$,
		 * [latex2jsfun description]
		 * @param  {[type]} expression [description]
		 * @param  {[type]} val        [description]
		 * @return {[type]}            [description]
		 */
		latex2jsfun2: function(expression,val) {
			// Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
			// and tries to evaluate it to a number.
			expression = '' + expression;
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
					[/\\text{([^{}]*)}/ig, '($1)'],
					[/\\sqrt{([^{}]*)}/ig, '(sqrt($1))'],
					[/\\lg\\left\(([^\(\)]+)\\right\)/g, '((log($1))/(log(10)))'],//log解析还有问题
					[/\\frac{([^{}]*)}{([^{}]*)}/ig, '(($1)/($2))'],
					[/\\left\|([^\|]*)\\right\|/g, '(abs($1))'],
					[/((?:[x])|(?:[0-9]+)|(?:\([^\(\)]\)))\^((?:[x])|(?:[0-9])|(?:{[^{}]+}))/ig, '(pow($1,$2))']
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
				[/\)sin/ig, ')*sin'], // Add times between ending and starting parenthesis )
				[/\)cos/ig, ')*cos'], // Add times between ending and starting parenthesis )
				[/\)tan/ig, ')*tan'], // Add times between ending and starting parenthesis )
				[/\)log/ig, ')*log'], // Add times between ending and starting parenthesis )
				
				
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
		},
		/**
		 * [latex2jsfun description]
		 * 1. remove math symbol
		 * 2. only [a-zA-Z]
		 * 3. num-->@num#
		 * @param  {[type]} expression [description]
		 * @param  {[type]} val        [description]
		 * @return {[type]}            [description]
		 */
		latex2jsfun3: function(expression,val) {
			var mathSymbol=/sin|cos|tan|sqrt|lg|log|ln|frac|pi|e|text|left|right/ig;
			var withOutSymbol=expression.split(mathSymbol);
			var symbolList=[];
			expression.replace(mathSymbol,function(s){
				symbolList.push(s);
				return s;
			});
			console.log('symbolList',symbolList,'withOutSymbol',withOutSymbol)

			var tempString=withOutSymbol.join('');
			var params=['a','b','c','d','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];// except e or E for Math.e
			var opt={};
			for(var i=0;i<params.length;i++){
				if(tempString.indexOf(params[i])>=0){
					// this.mathParams[params[i]]=this.mathParams[params[i]] || 0;
					if(!this.mathParams.hasOwnProperty(params[i])){
						this.mathParams[params[i]]=0;
						if('x'!=params[i])Flotr.EventAdapter.fire(this,'flotr:addnewparam',[params[i]]);
					}
					opt[params[i]]=opt[params[i]] || 0;
				}
			}
			console.log('opt',opt);
			for(var key in opt){
				for(i=0;i<withOutSymbol.length;i++){
					withOutSymbol[i]=withOutSymbol[i].replace(key,'@'+key+'#');
				}
			}

			function foldMerge(long,short){
				var temp=[];
				for(var i=0;i<short.length;i++){
					temp.push(long[i],short[i]);
				}
				temp.push(long[long.length-1]);
				console.log('temp',temp)
				return temp;
			}
			expression=foldMerge(withOutSymbol,symbolList).join('');
			expression=expression.replace(/(([0-9]+\.?[0-9]+)|([0-9]+))/g,'@$1#');//filter num
			expression=expression.replace(/\\left\(/g,'@{');//
			expression=expression.replace(/\\right\)/g,'}#');//
			expression=expression.replace(/\#\@/g,'#*@');// add times '*'
			console.log('267=========',expression);
			// Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
			// and tries to evaluate it to a number.
			expression = '' + expression;
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
					[/\\text{\@([^{}]*)}/ig, '($1)'],
					[/\@{([^{}]+)}\#(?!\^)/g, '@($1)#'],
					[/\@{?([^{}]+)}\#?\^{?\@([^{}]+)\#}?/g, '(pow($1,$2))'],

					[/\\sqrt{([^{}]*)}/ig, '(sqrt($1))'],
					[/\\lg{\@([[^{}]]+)\#}/g, '((log($1))/(log(10)))'],//log解析还有问题
					[/\\frac{([^{}]*)}{([^{}]*)}/ig, '(($1)/($2))'],
					[/\\left\|([^\|]*)\\right\|/g, '(abs($1))']
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
				
				[/PI/ig,'(PI)'],
				[/e/g,'(E)'],
				[/\)\(/ig, ')*('], // Add times between ending and starting parenthesis )
				[/\#sin/ig, '*sin'], // Add times between ending and starting parenthesis )
				[/\#cos/ig, '*cos'], // Add times between ending and starting parenthesis )
				[/\#tan/ig, '*tan'], // Add times between ending and starting parenthesis )
				[/\#log/ig, '*log'], // Add times between ending and starting parenthesis )
				
				
				[/\\cdot/ig, '*'], // Replace cdot with times
				[/\@|\#/g, ''],
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
				console.log(reponce[i][0], ' ==  ',expression)
			}
			//expression = expression.replace('opt.x', 'x');
			var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
				valid = true;
			console.log(expression)
			expression = expression.replace(reg, function(word) {
				console.log(word)
				if(word=='x') return word
				if (Math.hasOwnProperty(word)) {
					return 'Math.' + word;
				}else{
					if(opt.hasOwnProperty(word)){
						return 'opt.' + word;
					}else{
						valid = false;
						return word;
					}
				} 
			});
			console.log(expression)
			if (!valid) {
				throw 'Invalidexpression';
			} else {
				try {
					return eval('(function(){return function (opt,x){return '+expression+'}})()');
				} catch (err) {
					console.log(err)
					throw 'Invalidexpression';
				}
			}
		},
		/**
		 * [latex2jsfun description]
		 * 1. remove math symbol
		 * 2. only [a-zA-Z]
		 * 3. num-->@num#
		 * 4. ()^()-->pow{}{}
		 * @param  {[type]} expression [description]
		 * @param  {[type]} val        [description]
		 * @return {[type]}            [description]
		 */
		latex2jsfun: function(expression,val) {
			var mathSymbol=/sin|cos|tan|sqrt|lg|log|ln|frac|pi|e|text|left|right/ig;
			var withOutSymbol=expression.split(mathSymbol);
			var symbolList=[];
			expression.replace(mathSymbol,function(s){
				symbolList.push(s);
				return s;
			});
			console.log('symbolList',symbolList,'withOutSymbol',withOutSymbol)

			var tempString=withOutSymbol.join('');
			var params=['a','b','c','d','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];// except e or E for Math.e
			var opt={};
			for(var i=0;i<params.length;i++){
				if(tempString.indexOf(params[i])>=0){
					// this.mathParams[params[i]]=this.mathParams[params[i]] || 0;
					if(!this.mathParams.hasOwnProperty(params[i])){
						this.mathParams[params[i]]=0;
						if('x'!=params[i])Flotr.EventAdapter.fire(this,'flotr:addnewparam',[params[i]]);
					}
					opt[params[i]]=opt[params[i]] || 0;
				}
			}
			// console.log('opt',opt);
			for(var key in opt){
				for(i=0;i<withOutSymbol.length;i++){
					withOutSymbol[i]=withOutSymbol[i].replace(key,'@'+key+'#');
				}
			}

			function foldMerge(long,short){
				var temp=[];
				for(var i=0;i<short.length;i++){
					temp.push(long[i],short[i]);
				}
				temp.push(long[long.length-1]);
				console.log('temp',temp)
				return temp;
			}
			expression=foldMerge(withOutSymbol,symbolList).join('');
			expression=expression.replace(/(([0-9]+\.?[0-9]+)|([0-9]+))/g,'@$1#');//filter num
			expression=expression.replace(/\\left\(/g,'@(');//
			expression=expression.replace(/\\right\)/g,')#');//
			expression=expression.replace(/\#\@/g,'#*@');// add times '*'
			console.log('267=========',expression);
			// Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
			// and tries to evaluate it to a number.
			expression = '' + expression;
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
					[/\\text{\@([^{}]*)}/ig, '($1)'],
					// [/\@{([^{}]+)}\#(?!\^)/g, '@($1)#'],
					[/\\pow{([^{}]+)}{([^{}]+)}/g, '(pow($1,$2))'],

					[/\\sqrt{([^{}]*)}/ig, '(sqrt($1))'],
					[/\\lg{\@([[^{}]]+)\#}/g, '((log($1))/(log(10)))'],//log解析还有问题
					[/\\frac{([^{}]*)}{([^{}]*)}/ig, '(($1)/($2))'],
					[/\\left\|([^\|]*)\\right\|/g, '(abs($1))']
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
				
				[/PI/ig,'(PI)'],
				[/e/g,'(E)'],
				[/\)\(/ig, ')*('], // Add times between ending and starting parenthesis )
				[/\#sin/ig, '*sin'], // Add times between ending and starting parenthesis )
				[/\#cos/ig, '*cos'], // Add times between ending and starting parenthesis )
				[/\#tan/ig, '*tan'], // Add times between ending and starting parenthesis )
				[/\#log/ig, '*log'], // Add times between ending and starting parenthesis )
				
				
				[/\\cdot/ig, '*'], // Replace cdot with times
				[/\@|\#/g, ''],
				// [/e/g, 'E'],
				// [/([0-9]+)E/g, '$1*E'],
				// [/\)x/g, ')*x'],
				[/EPI/g, 'E*PI'],
				[/PI E/g, 'PI*E']
			]

			function toPreFix(express){
				var index=express.indexOf('^');
				var ret=express;
				if(index<0) return express;
				var lastSymbol=express.charAt(index-2);
				var dishu='';
				var begin;
				if(lastSymbol!=')'){
					dishu='#}';
					for(var i=index-2;i>=0;i--){
						dishu=express.charAt(i)+dishu;
						if(express.charAt(i)=='@'){
							begin=i;
							dishu='{'+dishu;
							break;
						}
					}
				}else{
					var count=1;
					dishu=')}';
					for(var i=index-3;i>=0;i--){
						dishu=express.charAt(i)+dishu;
						if(express.charAt(i)==')') count++;
						if(express.charAt(i)=='(') count--;
						if(count==0){
							begin=i-1;//for @
							dishu='{'+dishu;
							break;
						}
					}
				}
				console.log('dishu=',dishu)
				
				var firstSymbol=express.charAt(index+1);
				var zhishu='';
				var end=express.length;
				if(firstSymbol=='{'){
					var count=1;
					zhishu='{';
					for(var i=index+2;i<express.length;i++){
						zhishu+=express.charAt(i);
						if(express.charAt(i)=='{') count++;
						if(express.charAt(i)=='}') count--;
						if(count==0) {
							end=i;
							break;
						}
					}
				}
				if(firstSymbol=='@'){
					zhishu='{@';
					for(var i=index+2;i<express.length;i++){
						zhishu+=express.charAt(i);
						if(express.charAt(i)=='#'){
							zhishu+='}';
							end=i;
							break;
						}
					}
				}
				console.log('zhishu=',zhishu)
				var tihuan='\\pow'+dishu+zhishu;
				if(dishu.length>0 && zhishu.length>0){
					ret = express.substr(0,begin)+tihuan+express.substr(end+1);
				}else{
					ret =express;
				}
				
				console.log('ret=',ret);

				return ret;
			}

			var oldexpr = '';
			// expression='@(@2#^{@12#})#^{@(@2#^{@12#})#}'
			while (oldexpr != expression) {
				oldexpr = expression;
				// console.log(expression)
				expression = toPreFix(expression);
			}
			oldexpr = '';
			console.log(expression);
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
				// console.log(reponce[i][0], ' ==  ',expression)
			}
			//expression = expression.replace('opt.x', 'x');
			var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,
				valid = true;
			console.log(expression)
			expression = expression.replace(reg, function(word) {
				console.log(word)
				if(word=='x') return word
				if (Math.hasOwnProperty(word)) {
					return 'Math.' + word;
				}else{
					if(opt.hasOwnProperty(word)){
						return 'opt.' + word;
					}else{
						valid = false;
						return word;
					}
				} 
			});
			console.log(expression)
			if (!valid) {
				throw 'Invalidexpression';
			} else {
				try {
					return eval('(function(){return function (opt,x){return '+expression+'}})()');
				} catch (err) {
					console.log(err)
					throw 'Invalidexpression';
				}
			}
		}
	})
})()