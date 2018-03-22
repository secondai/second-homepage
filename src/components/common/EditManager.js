import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'

import autobind from 'autobind-decorator'

// Higher Order Component
const withEditManager = (WrappedComponent, opts) => {
  opts = opts || {};
  return class EditManagerHOC extends Component {
    constructor(props){
      super(props);

      // lock each field after "first data" 
      // - same as "don't update"
      opts.lockFieldsOnAnyData = false;

      // sensible default: prevent a field from being updated by the parent if it has been edited already 
      opts.lockFieldsAfterEdit = true;

      opts.fieldCompareFunc = opts.fieldCompareFunc || {};
      // (previous, next)=>{
      //   return JSON.stringify(previous) === JSON.stringify(next);
      // }

      this.state = {
        opts,
        fields: {
          // title: {
          //   parentLock: false, // locked for update by parent/remote
          //   editLock: false, // locked for update by editing/child
          //   pendingParent: false, // is there a pending value?
          //   pendingParentValue: String, // from remote/parent
          //   parentValue: String, // the value that the parent was initially
          //   value: String
          // }
        }
        // fieldsLocked: {}, // {fieldName: true}
        // fieldsWithPendingUpdates: {}, // fields that are locked, but have an update awaiting 
        // fieldValues: {
        //   // fieldname: value
        // }
      }

      // window.setTimeout(()=>{
      //   this.incomingData(this.props);
      // },0);

    }

    componentWillReceiveProps(nextProps){
      // Receiving updated props 
      // - set state 
      // - update the fieldsWithPendingUpdates for fields that have pending changes

      // const ParentData = props[this.state.opts.editProp];

      // if(ParentData._id != this.props[this.state.opts.editProp]._id){
      //   console.log('Changing EditManager');
      // }

      // each field, compare if locked, setState if not
      this.incomingData(nextProps);
    }

    componentWillMount(){
      this.incomingData(this.props);
    }


    @autobind
    incomingData(props){
      // handles merge of new props with current state 

      let fields = JSON.parse(JSON.stringify(this.state.fields));

      // console.log('incomingData Props:', props);

      const ParentData = props[this.state.opts.editProp];
      console.log('PROPS:', props);

      // iterate over passed-in keys
      this.state.opts.fields.forEach(fieldKey=>{

        if(fields.hasOwnProperty(fieldKey)){
          // already set this field's initial values, now being updated by the parent 

          let fieldInfo = fields[fieldKey];

          // is it any different? 
          // - from the previously stored value (NOT from the current edited value!) 
          //   - per-field comparison function
          let isSame = false;
          if(this.state.opts.fieldCompareFunc && this.state.opts.fieldCompareFunc[fieldKey]){
            isSame = this.state.opts.fieldCompareFunc[fieldKey](fieldInfo.parentValue, ParentData[fieldKey]);
          } else {
            isSame = ((prev, next)=>{
              return JSON.stringify(prev) === JSON.stringify(next);
            })(fieldInfo.parentValue, ParentData[fieldKey])
          }

          if(isSame){
            // console.log('No update to:', fieldKey);
            return;
          }

          // we've set it already
          if(fieldInfo.parentLock){
            // locked, need to update "pending" value 
            fieldInfo.pendingParent = true;
            fieldInfo.pendingParentValue = ParentData[fieldKey];
          } else {
            // not locked for editing by parent, update the value
            // - also update the "parentValue"
            fieldInfo.parentValue = ParentData[fieldKey];


            let convertServerValueFunc = v => v; // just returning the value
            let convertServerValueOnceFunc = v => v; // just returning the value

            if(this.state.opts.fieldConvertServerFunc && this.state.opts.fieldConvertServerFunc[fieldKey]){
              convertServerValueFunc = this.state.opts.fieldConvertServerFunc[fieldKey];
            }

            // convert if coming from server
            if(this.state.opts.fieldConvertServerOnceFunc && this.state.opts.fieldConvertServerOnceFunc[fieldKey]){
              convertServerValueOnceFunc = this.state.opts.fieldConvertServerOnceFunc[fieldKey];
            }

            fieldInfo.value = convertServerValueOnceFunc(ParentData[fieldKey]);
            fieldInfo.value = convertServerValueFunc(fieldInfo.value);
          }

        } else {
          // not set yet (initial)
          // - set it now 
          // - do NOT lock it yet (unless opts.lockFieldsOnAnyData)

          // in ParentData yet?
          if(ParentData.hasOwnProperty(fieldKey)){

            // this is used to convert the server-side value
            // - we need to make sure to re-save it correctly! 
            let convertServerValueFunc = v => v; // just returning the value
            let convertServerValueOnceFunc = v => v; // just returning the value

            if(this.state.opts.fieldConvertServerFunc && this.state.opts.fieldConvertServerFunc[fieldKey]){
              convertServerValueFunc = this.state.opts.fieldConvertServerFunc[fieldKey];
            }

            // convert once if coming from server
            if(this.state.opts.fieldConvertServerOnceFunc && this.state.opts.fieldConvertServerOnceFunc[fieldKey]){
              convertServerValueOnceFunc = this.state.opts.fieldConvertServerOnceFunc[fieldKey];
            }

            fields[fieldKey] = {
              parentLock: false,
              editLock: false, // not allowed to edit?? 
              pendingParent: false,
              pendingParentValue: null, 
              parentValue: ParentData[fieldKey],
              value: convertServerValueFunc(convertServerValueOnceFunc(ParentData[fieldKey])), // this value is updated by the setEditField value function! it has the "local state" value 
              convertServerValueFunc,
              convertServerValueOnceFunc
            }
          } else {
            console.error('missing from ParentData already:', fieldKey);
          }
        }

      })

      this.setState({
        fields
      })

    }

    @autobind
    handleSetEditStateFromChild(fieldKey, value, cb){
      // setting the state from the child element 
      // - 

      // should use immutability instead (speed) 
      let fields = JSON.parse(JSON.stringify(this.state.fields));

      // mark this field as "parentLock" so it doesn't get updated 
      // - triggers fieldsWithPendingUpdates to start getting filled 

      let fieldInfo = fields[fieldKey];

      // should exist!
      if(!fieldInfo){
        console.log('Missing Edit coverage for this field!', fieldKey);
        return false;
      }

      // not allowed to edit?
      if(fieldInfo.editLock){
        console.log('EditLock on this field!', fieldKey);
        return false;
      }



      let convertServerValueFunc = v => v; // just returning the value

      if(this.state.opts.fieldConvertServerFunc && this.state.opts.fieldConvertServerFunc[fieldKey]){
        convertServerValueFunc = this.state.opts.fieldConvertServerFunc[fieldKey];
      }

      // Update parentLock
      fieldInfo.parentLock = true;
      fieldInfo.value = convertServerValueFunc(value);


      this.setState({
        fields
      }, cb)


    }

    render() {
      // const { auth, updateAuth } = this.context

      const customProps = {}

      if(this.state.opts.setEditStateProp){
        customProps[this.state.opts.setEditStateProp] = this.handleSetEditStateFromChild;
      } else {
        customProps['setEditState'] = this.handleSetEditStateFromChild;
      }
      if(this.state.opts.editStateProp){
        customProps[this.state.opts.editStateProp] = this.state;
      } else {
        customProps['editState'] = this.state;
      }


      return (

        <WrappedComponent 
          {...this.props}
          {...customProps}
          />
      )
    }
  }
}

export default withEditManager
export {
  withEditManager
}