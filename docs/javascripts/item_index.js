if (!window.PDoc) window.PDoc = {};
PDoc.elements = {
  'QMock section': { 'name': 'QMock section', 'type': 'section', 'path': 'qmock/' },
'QMock.create': { 'name': 'QMock.create', 'type': 'class method', 'path': 'qmock/qmock/create/' },
'QMock.config': { 'name': 'QMock.config', 'type': 'namespace', 'path': 'qmock/qmock/config/' },
'QMock.config.failslow': { 'name': 'QMock.config.failslow', 'type': 'class property', 'path': 'qmock/qmock/config/failslow/' },
'QMock.config.compare': { 'name': 'QMock.config.compare', 'type': 'class property', 'path': 'qmock/qmock/config/compare/' },
'QMock.config.delay': { 'name': 'QMock.config.delay', 'type': 'class property', 'path': 'qmock/qmock/config/delay/' },
'QMock.utils.is': { 'name': 'QMock.utils.is', 'type': 'class method', 'path': 'qmock/qmock/utils/is/' },
'QMock.utils.enumerate': { 'name': 'QMock.utils.enumerate', 'type': 'class method', 'path': 'qmock/qmock/utils/enumerate/' },
'QMock.utils.iterate': { 'name': 'QMock.utils.iterate', 'type': 'class method', 'path': 'qmock/qmock/utils/iterate/' },
'QMock.utils.test': { 'name': 'QMock.utils.test', 'type': 'class method', 'path': 'qmock/qmock/utils/test/' },
'Receiver section': { 'name': 'Receiver section', 'type': 'section', 'path': 'receiver/' },
'Receiver': { 'name': 'Receiver', 'type': 'class', 'path': 'receiver/receiver/' },
'Receiver#method': { 'name': 'Receiver#method', 'type': 'instance method', 'path': 'receiver/receiver/prototype/method/' },
'Receiver#property': { 'name': 'Receiver#property', 'type': 'instance method', 'path': 'receiver/receiver/prototype/property/' },
'Receiver#namespace': { 'name': 'Receiver#namespace', 'type': 'instance method', 'path': 'receiver/receiver/prototype/namespace/' },
'Mock#expects': { 'name': 'Mock#expects', 'type': 'instance method', 'path': 'mock/mock/prototype/expects/' },
'Receiver#verify': { 'name': 'Receiver#verify', 'type': 'instance method', 'path': 'receiver/receiver/prototype/verify/' },
'Receiver#reset': { 'name': 'Receiver#reset', 'type': 'instance method', 'path': 'receiver/receiver/prototype/reset/' },
'Receiver#excise': { 'name': 'Receiver#excise', 'type': 'instance method', 'path': 'receiver/receiver/prototype/excise/' },
'Receiver#__getExceptions': { 'name': 'Receiver#__getExceptions', 'type': 'instance method', 'path': 'receiver/receiver/prototype/__getexceptions/' },
'Receiver#__getState': { 'name': 'Receiver#__getState', 'type': 'instance method', 'path': 'receiver/receiver/prototype/__getstate/' },
'Mock section': { 'name': 'Mock section', 'type': 'section', 'path': 'mock/' },
'Mock': { 'name': 'Mock', 'type': 'class', 'path': 'mock/mock/' },
'Mock#id': { 'name': 'Mock#id', 'type': 'instance method', 'path': 'mock/mock/prototype/id/' },
'Mock#accepts': { 'name': 'Mock#accepts', 'type': 'instance method', 'path': 'mock/mock/prototype/accepts/' },
'Mock#receives': { 'name': 'Mock#receives', 'type': 'instance method', 'path': 'mock/mock/prototype/receives/' },
'Mock#returns': { 'name': 'Mock#returns', 'type': 'instance method', 'path': 'mock/mock/prototype/returns/' },
'Mock#required': { 'name': 'Mock#required', 'type': 'instance method', 'path': 'mock/mock/prototype/required/' },
'Mock#overload': { 'name': 'Mock#overload', 'type': 'instance method', 'path': 'mock/mock/prototype/overload/' },
'Mock#data': { 'name': 'Mock#data', 'type': 'instance method', 'path': 'mock/mock/prototype/data/' },
'Mock#async': { 'name': 'Mock#async', 'type': 'instance method', 'path': 'mock/mock/prototype/async/' },
'Mock#chain': { 'name': 'Mock#chain', 'type': 'instance method', 'path': 'mock/mock/prototype/chain/' },
'Mock#verify': { 'name': 'Mock#verify', 'type': 'instance method', 'path': 'mock/mock/prototype/verify/' },
'Mock#calls': { 'name': 'Mock#calls', 'type': 'instance method', 'path': 'mock/mock/prototype/calls/' },
'Mock#end': { 'name': 'Mock#end', 'type': 'instance method', 'path': 'mock/mock/prototype/end/' },
'Mock#reset': { 'name': 'Mock#reset', 'type': 'instance method', 'path': 'mock/mock/prototype/reset/' },
'Mock#andExpects': { 'name': 'Mock#andExpects', 'type': 'instance method', 'path': 'mock/mock/prototype/andexpects/' },
'Mock#atLeast': { 'name': 'Mock#atLeast', 'type': 'instance method', 'path': 'mock/mock/prototype/atleast/' },
'Mock#noMoreThan': { 'name': 'Mock#noMoreThan', 'type': 'instance method', 'path': 'mock/mock/prototype/nomorethan/' },
'Mock#excise': { 'name': 'Mock#excise', 'type': 'instance method', 'path': 'mock/mock/prototype/excise/' },
'Mock#property': { 'name': 'Mock#property', 'type': 'instance method', 'path': 'mock/mock/prototype/property/' },
'Mock#namespace': { 'name': 'Mock#namespace', 'type': 'instance method', 'path': 'mock/mock/prototype/namespace/' },
'Mock#method': { 'name': 'Mock#method', 'type': 'instance method', 'path': 'mock/mock/prototype/method/' },
'Mock#__getState': { 'name': 'Mock#__getState', 'type': 'instance method', 'path': 'mock/mock/prototype/__getstate/' },
'Mock#__getExceptions': { 'name': 'Mock#__getExceptions', 'type': 'instance method', 'path': 'mock/mock/prototype/__getexceptions/' },
'new Mock': { 'name': 'new Mock', 'type': 'constructor', 'path': 'mock/mock/new/' },
'QMock': { 'name': 'QMock', 'type': 'class', 'path': 'qmock/qmock/' },
'QMock.Mock': { 'name': 'QMock.Mock', 'type': 'class method', 'path': 'qmock/qmock/mock/' },
'QMock.utils': { 'name': 'QMock.utils', 'type': 'namespace', 'path': 'qmock/qmock/utils/' },
'QMock.utils.verify': { 'name': 'QMock.utils.verify', 'type': 'class method', 'path': 'qmock/qmock/utils/verify/' }
};