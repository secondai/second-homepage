
import gql from 'graphql-tag'

let fragment = {};
let query = {};
let mutation = {};


// Mutations

mutation['addKey'] = gql`
	mutation (
		$record: JSON
	){
		key {
			add(
				record: $record
			)
		}
	}
`

mutation['newKey'] = gql`
	mutation (
		$record: CreateOneKeysInput!
	){
		key {
			create(
				record: $record
			) {
				recordId
			}
		}
	}
`

mutation['updateKey'] = gql`
	mutation (
		$record: UpdateByIdKeysInput!
	){
		key {
			updateById (
				record: $record
			) {
				recordId
			}
		}
	}
`



// Queries


query['keys'] = gql`
	query (
		$filter: FilterFindManyKeysInput
	) {
		viewer {
			key {
				many (
					filter: $filter
					sort: _ID_DESC
				) {
					_id
					name
					pubKey
					publicContact
					canCreate
					createdAt
				}
			}
		}
	}
`

query['key'] = gql`
	query (
		$_id: MongoID!
	) {
		viewer {
			langauge {
				byId (
					_id: $_id
				) {
					_id
					name
					pubKey
					publicContact
					canCreate
					createdAt
				}
			}
		}
	}
`

query['keyByUuid'] = gql`
	query (
		$uuid: String
	) {
		viewer {
			key {
				one (
					filter: {
						uuid: $uuid
					}
				) {
					_id
					name
					pubKey
					publicContact
					canCreate
					createdAt
				}
			}
		}
	}
`



export default {
	query,
	mutation,
	fragment
};