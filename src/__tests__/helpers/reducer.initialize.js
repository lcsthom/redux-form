import actions from '../../actions'
const { initialize } = actions

const describeInitialize = (reducer, expect, { fromJS }) => () => {
  it('should set initialize values on initialize on empty state', () => {
    const state = reducer(
      undefined,
      initialize('foo', { myField: 'initialValue' })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        }
      }
    })
  })

  it('should allow initializing null values', () => {
    const state = reducer(
      undefined,
      initialize('foo', { bar: 'baz', dog: null })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          bar: 'baz',
          dog: null
        },
        initial: {
          bar: 'baz',
          dog: null
        }
      }
    })
  })

  it('should initialize nested values on initialize on empty state', () => {
    const state = reducer(
      undefined,
      initialize('foo', { myField: { subField: 'initialValue' } })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: 'initialValue'
          }
        },
        initial: {
          myField: {
            subField: 'initialValue'
          }
        }
      }
    })
  })

  it('should initialize array values on initialize on empty state', () => {
    const state = reducer(
      undefined,
      initialize('foo', { myField: ['initialValue'] })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: ['initialValue']
        },
        initial: {
          myField: ['initialValue']
        }
      }
    })
  })

  it('should initialize array values with subvalues on initialize on empty state', () => {
    const state = reducer(
      undefined,
      initialize('foo', {
        accounts: [
          {
            name: 'Bobby Tables',
            email: 'bobby@gmail.com'
          },
          {
            name: 'Sammy Tables',
            email: 'sammy@gmail.com'
          }
        ]
      })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          accounts: [
            {
              name: 'Bobby Tables',
              email: 'bobby@gmail.com'
            },
            {
              name: 'Sammy Tables',
              email: 'sammy@gmail.com'
            }
          ]
        },
        initial: {
          accounts: [
            {
              name: 'Bobby Tables',
              email: 'bobby@gmail.com'
            },
            {
              name: 'Sammy Tables',
              email: 'sammy@gmail.com'
            }
          ]
        }
      }
    })
  })

  it('should set initialize values, making form pristine when initializing', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'dirtyValue'
          },
          fields: {
            myField: {
              touched: true
            }
          }
        }
      }),
      initialize('foo', { myField: 'cleanValue' })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'cleanValue'
        },
        initial: {
          myField: 'cleanValue'
        }
      }
    })
  })

  it('should set initialize values, and not remove registered fields', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            username: { name: 'username', type: 'Field', count: 1 },
            password: { name: 'password', type: 'Field', count: 1 }
          },
          values: {
            username: 'dirtyValue'
          },
          fields: {
            username: {
              touched: true
            }
          }
        }
      }),
      initialize('foo', { username: 'cleanValue', password: 'cleanPassword' })
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          username: { name: 'username', type: 'Field', count: 1 },
          password: { name: 'password', type: 'Field', count: 1 }
        },
        values: {
          username: 'cleanValue',
          password: 'cleanPassword'
        },
        initial: {
          username: 'cleanValue',
          password: 'cleanPassword'
        }
      }
    })
  })

  it('should not retain submitSucceeded when keepSubmitSucceeded is not set', () => {
    const state = reducer(
      fromJS({
        foo: {
          submitSucceeded: true
        }
      }),
      initialize('foo', {})
    )
    expect(state).toEqualMap({
      foo: {
        values: {},
        initial: {}
      }
    })
  })

  it('should retain submitSucceeded when keepSubmitSucceeded is set', () => {
    const state = reducer(
      fromJS({
        foo: {
          submitSucceeded: true
        }
      }),
      initialize('foo', {}, { keepSubmitSucceeded: true })
    )
    expect(state).toEqualMap({
      foo: {
        values: {},
        initial: {},
        submitSucceeded: true
      }
    })
  })

  it('should retain dirty values when keepDirty is set', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { name: 'myField', type: 'Field', count: 1 }
          },
          values: {
            myField: 'dirtyValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      }),
      initialize('foo', { myField: 'newValue' }, true)
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { name: 'myField', type: 'Field', count: 1 }
        },
        values: {
          myField: 'dirtyValue'
        },
        initial: {
          myField: 'newValue'
        }
      }
    })
  })

  it('should replace pristine values when keepDirty is set', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { name: 'myField', type: 'Field', count: 1 }
          },
          values: {
            myField: 'initialValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      }),
      initialize('foo', { myField: 'newValue' }, true)
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { name: 'myField', type: 'Field', count: 1 }
        },
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'newValue'
        }
      }
    })
  })

  it('should treat a matching dirty value as pristine when keepDirty is set', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { name: 'myField', type: 'Field', count: 1 }
          },
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      }),
      initialize('foo', { myField: 'newValue' }, true)
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { name: 'myField', type: 'Field', count: 1 }
        },
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'newValue'
        }
      }
    })
  })

  it('allows passing keepDirty in options argument', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { name: 'myField', type: 'Field', count: 1 }
          },
          values: {
            myField: 'dirtyValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      }),
      initialize('foo', { myField: 'newValue' }, { keepDirty: true })
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { name: 'myField', type: 'Field', count: 1 }
        },
        values: {
          myField: 'dirtyValue'
        },
        initial: {
          myField: 'newValue'
        }
      }
    })
  })

  it('updateDeepValues should update value of initialized field in a deep state with keepDirty', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { name: 'myField', type: 'Field', count: 1 }
          },
          values: {
            myField: {
              myInnerDirtyField: 'dirtyValue',
              myInnerField: 'initialValue'
            }
          },
          initial: {
            myField: {
              myInnerDirtyField: 'initialValueOfDirtyField',
              myInnerField: 'initialValue'
            }
          }
        }
      }),
      initialize(
        'foo',
        {
          myField: {
            myInnerDirtyField: 'initialValueOfDirtyField',
            myInnerField: 'newInitialValue'
          }
        },
        true,
        {
          updateDeepValues: true,
          updateUnregisteredFields: true
        }
      )
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { name: 'myField', type: 'Field', count: 1 }
        },
        values: {
          myField: {
            myInnerDirtyField: 'dirtyValue',
            myInnerField: 'newInitialValue'
          }
        },
        initial: {
          myField: {
            myInnerDirtyField: 'initialValueOfDirtyField',
            myInnerField: 'newInitialValue'
          }
        }
      }
    })
  })

  it('updateDeepValues should update value of initialized field array in a deep state with keepDirty', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { name: 'myField', type: 'Field', count: 1 }
          },
          values: {
            myField: {
              myArray: [
                {
                  myInnerDirtyField: 'dirtyValue',
                  myInnerField: 'initialValue'
                },
                {
                  myInnerDirtyField: 'dirtyValue2',
                  myInnerField: 'initialValue2'
                }
              ]
            }
          },
          initial: {
            myField: {
              myArray: [
                {
                  myInnerDirtyField: 'initialValueOfDirtyField',
                  myInnerField: 'initialValue'
                },
                {
                  myInnerDirtyField: 'initialValueOfDirtyField2',
                  myInnerField: 'initialValue2'
                }
              ]
            }
          }
        }
      }),
      initialize(
        'foo',
        {
          myField: {
            myArray: [
              {
                myInnerDirtyField: 'initialValueOfDirtyField',
                myInnerField: 'newInitialValue'
              },
              {
                myInnerDirtyField: 'initialValueOfDirtyField2',
                myInnerField: 'newInitialValue2'
              }
            ]
          }
        },
        true,
        {
          updateDeepValues: true,
          updateUnregisteredFields: true
        }
      )
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { name: 'myField', type: 'Field', count: 1 }
        },
        values: {
          myField: {
            myArray: [
              {
                myInnerDirtyField: 'dirtyValue',
                myInnerField: 'newInitialValue'
              },
              {
                myInnerDirtyField: 'dirtyValue2',
                myInnerField: 'newInitialValue2'
              }
            ]
          }
        },
        initial: {
          myField: {
            myArray: [
              {
                myInnerDirtyField: 'initialValueOfDirtyField',
                myInnerField: 'newInitialValue'
              },
              {
                myInnerDirtyField: 'initialValueOfDirtyField2',
                myInnerField: 'newInitialValue2'
              }
            ]
          }
        }
      }
    })
  })

  it('should persist warnings if they exist', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: [{ name: 'myField', type: 'Field' }],
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'initialValue'
          },
          warning: 'form wide warning',
          syncWarnings: {
            myField: 'field warning'
          }
        }
      }),
      initialize('foo', { myField: 'newValue' }, true)
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: [{ name: 'myField', type: 'Field' }],
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'newValue'
        },
        warning: 'form wide warning',
        syncWarnings: {
          myField: 'field warning'
        }
      }
    })
  })

  it('should persist errors if they exist', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: [{ name: 'myField', type: 'Field' }],
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'initialValue'
          },
          error: 'form wide error',
          syncErrors: {
            myField: 'field error'
          }
        }
      }),
      initialize('foo', { myField: 'newValue' }, true)
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: [{ name: 'myField', type: 'Field' }],
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'newValue'
        },
        error: 'form wide error',
        syncErrors: {
          myField: 'field error'
        }
      }
    })
  })

  it('should not insert null versions of objects into arrays for deleted indices', () => {
    const values = {
      myField: [{ name: 'One' }]
    }
    const initial = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }

    const registeredFields = {
      myField: { name: 'myField', type: 'Field', count: 1 },
      'myField.0.name': { name: 'myField.0.name', type: 'Field', count: 1 },
      'myField.1.name': { name: 'myField.1.name', type: 'Field', count: 0 }
    }

    const state = reducer(
      fromJS({ foo: { registeredFields, values, initial } }),
      initialize('foo', initial, true)
    )

    expect(state).toEqualMap({
      foo: { registeredFields, values, initial }
    })
  })

  it('should update pristine values if keepDirty and updateUnregisteredFields, even if the field is not registered (yet)', () => {
    const values = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }
    const initial = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }

    const newInitial = {
      myField: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]
    }

    const registeredFields = {}

    const state = reducer(
      fromJS({ foo: { registeredFields, values, initial } }),
      initialize('foo', newInitial, true, { updateUnregisteredFields: true })
    )

    expect(state).toEqualMap({
      foo: { registeredFields, values: newInitial, initial: newInitial }
    })
  })

  it('should not create empty object if new initial value is an empty array and keepDirty is set', () => {
    const before = {
      myForm: {
        registeredFields: {
          myList: { name: 'myList', type: 'Field', count: 0 },
          'myList.0.name': { name: 'myList.0.name', type: 'Field', count: 0 }
        },
        values: {
          myList: []
        },
        initial: {
          myList: [{ name: '' }]
        }
      }
    }

    const actionInitialValues = {
      myList: []
    }
    const actionKeepDirty = true

    const state = reducer(
      fromJS(before),
      initialize('myForm', actionInitialValues, actionKeepDirty)
    )

    expect(state).toEqualMap(
      {
        myForm: {
          registeredFields: {
            myList: { name: 'myList', type: 'Field', count: 0 },
            'myList.0.name': { name: 'myList.0.name', type: 'Field', count: 0 }
          },
          values: {
            myList: []
          },
          initial: {
            myList: []
          }
        }
      },
      null,
      2
    )
  })

  it('should add new pristine values at the root level', () => {
    const newInitial = {
      oldField: 'oldValue',
      newField: 'newValue'
    }

    const registeredFields = {
      oldField: { name: 'oldField', type: 'Field', count: 1 }
    }

    const state = reducer(
      fromJS({
        foo: {
          registeredFields,
          values: {
            oldField: 'oldValue'
          },
          initial: {
            oldField: 'oldValue'
          }
        }
      }),
      initialize('foo', newInitial, true)
    )

    expect(state).toEqualMap({
      foo: {
        registeredFields,
        values: {
          oldField: 'oldValue',
          newField: 'newValue'
        },
        initial: newInitial
      }
    })
  })

  it('should add new pristine values at nested levels', () => {
    const newInitial = {
      group: {
        oldField: 'oldValue',
        newField: 'newValue'
      }
    }

    const registeredFields = {
      group: { name: 'group', type: 'Field', count: 1 },
      'group.oldField': { name: 'group.oldField', type: 'Field', count: 1 }
    }

    const state = reducer(
      fromJS({
        foo: {
          registeredFields,
          values: {
            group: {
              oldField: 'oldValue'
            }
          },
          initial: {
            group: {
              oldField: 'oldValue'
            }
          }
        }
      }),
      initialize('foo', newInitial, true)
    )

    expect(state).toEqualMap({
      foo: {
        registeredFields,
        values: {
          group: {
            oldField: 'oldValue',
            newField: 'newValue'
          }
        },
        initial: newInitial
      }
    })
  })

  it('should keep initial values although new ones are added', () => {
    const initial = {
      existingField: 'existingValue'
    }

    const newInitial = {
      newField: 'newValue'
    }

    const expectedInitial = {
      ...initial,
      ...newInitial
    }

    const state = reducer(undefined, initialize('foo', initial))
    const newState = reducer(
      state,
      initialize('foo', newInitial, { keepValues: true })
    )

    expect(newState).toEqualMap({
      foo: {
        initial: expectedInitial,
        values: expectedInitial
      }
    })
  })

  it('should keep old values add new pristine values at the root level', () => {
    const newInitial = {
      newField: 'newValue'
    }

    const registeredFields = {
      oldField: { name: 'oldField', type: 'Field', count: 1 }
    }

    const state = reducer(
      fromJS({
        foo: {
          registeredFields,
          values: {
            oldField: 'oldValue'
          },
          initial: {
            oldField: 'oldValue'
          }
        }
      }),
      initialize('foo', newInitial, true, { keepValues: true })
    )

    expect(state).toEqualMap({
      foo: {
        registeredFields,
        values: {
          oldField: 'oldValue',
          newField: 'newValue'
        },
        initial: {
          oldField: 'oldValue',
          newField: 'newValue'
        }
      }
    })
  })

  it('should overwrite all values as they are all pristine and add the new item in the array', () => {
    const values = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }
    const initial = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }

    const newInitial = {
      myField: [{ name: 'One' }, { name: 'Four' }, { name: 'Five' }]
    }

    const registeredFields = {}

    const state = reducer(
      fromJS({ foo: { registeredFields, values, initial } }),
      initialize('foo', newInitial, true, { updateUnregisteredFields: true })
    )

    expect(state).toEqualMap({
      foo: { registeredFields, values: newInitial, initial: newInitial }
    })
  })

  it('should keep only dirty value as keepDirty is true', () => {
    const values = {
      myField: [{ name: 'Four' }, { name: 'Five' }, { name: 'Three' }]
    }
    const initial = {
      myField: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]
    }

    const newInitial = {
      myField: [{ name: 'One' }]
    }

    const registeredFields = {}

    const state = reducer(
      fromJS({ foo: { registeredFields, values, initial } }),
      initialize('foo', newInitial, true, { updateUnregisteredFields: true })
    )

    expect(state).toEqualMap({
      foo: {
        registeredFields,
        values: { myField: [{ name: 'Four' }, { name: 'Five' }, { name: 'Three' }] },
        initial: newInitial
      }
    })
  })

  it('should keep only dirty value as keepDirty is true even if value is undefined', () => {
    const values = {
      myField: [{ name: 'One' }]
    }
    const initial = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }

    const newInitial = {
      myField: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]
    }

    const registeredFields = {}

    const state = reducer(
      fromJS({ foo: { registeredFields, values, initial } }),
      initialize('foo', newInitial, true, { updateUnregisteredFields: true })
    )

    expect(state).toEqualMap({
      foo: {
        registeredFields,
        values: { myField: [{ name: 'One' }, undefined, { name: 'Three' }] },
        initial: newInitial
      }
    })
  })

}

export default describeInitialize
