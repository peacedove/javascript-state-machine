Demo = function() {

  var output = document.getElementById('output'),
      demo   = document.getElementById('demo'),
      panic  = document.getElementById('panic'),
      warn   = document.getElementById('warn'),
      calm   = document.getElementById('calm'),
      clear  = document.getElementById('clear'),
      count  = 0;

  var log = function(msg, separate) {
    count = count + (separate ? 1 : 0);
    output.value = count + ": " + msg + "\n" + (separate ? "\n" : "") + output.value;
    demo.className = fsm.current;
    panic.disabled = fsm.cannot('panic');
    warn.disabled  = fsm.cannot('warn');
    calm.disabled  = fsm.cannot('calm');
    clear.disabled = fsm.cannot('clear');
  };

  var fsm = StateMachine.create({

    events: [
      { name: 'start', from: 'none',   to: 'green'  },
      { name: 'warn',  from: 'green',  to: 'yellow' },
      { name: 'panic', from: 'green',  to: 'red'    },
      { name: 'panic', from: 'yellow', to: 'red'    },
      { name: 'calm',  from: 'red',    to: 'yellow' },
      { name: 'clear', from: 'red',    to: 'green'  },
      { name: 'clear', from: 'yellow', to: 'green'  },
    ],

    callbacks: {
      onbeforeStart: function(event, from, to) { log("STARTING UP"); },
      onstart:       function(event, from, to) { log("READY");       },

      onbeforeWarn:  function(event, from, to) { log("START   EVENT: warn!",  true);  },
      onbeforePanic: function(event, from, to) { log("START   EVENT: panic!", true);  },
      onbeforeCalm:  function(event, from, to) { log("START   EVENT: calm!",  true);  },
      onbeforeClear: function(event, from, to) { log("START   EVENT: clear!", true);  },

      onWarn:        function(event, from, to) { log("FINISH  EVENT: warn!");         },
      onPanic:       function(event, from, to) { log("FINISH  EVENT: panic!");        },
      onCalm:        function(event, from, to) { log("FINISH  EVENT: calm!");         },
      onClear:       function(event, from, to) { log("FINISH  EVENT: clear!");        },

      onleaveGreen:  function(event, from, to) { log("LEAVE   STATE: green");  },
      onleaveYellow: function(event, from, to) { log("LEAVE   STATE: yellow"); },
      onleaveRed:    function(event, from, to) { log("LEAVE   STATE: red");    async(to); return StateMachine.ASYNC; },

      onGreen:       function(event, from, to) { log("ENTER   STATE: green");  },
      onYellow:      function(event, from, to) { log("ENTER   STATE: yellow"); },
      onRed:         function(event, from, to) { log("ENTER   STATE: red");    },

      onchangestate: function(event, from, to) { log("CHANGED STATE: " + from + " to " + to); }
    }
  });

  var async = function(to) {
    pending(to, 3);
    setTimeout(function() {
      pending(to, 2);
      setTimeout(function() {
        pending(to, 1);
        setTimeout(function() {
          fsm.transition(); // trigger deferred state transition
        }, 1000);
      }, 1000);
    }, 1000);
  };

  var pending = function(to, n) { log("PENDING STATE: " + to + " in ..." + n); };

  fsm.start();
  return fsm;

}();

