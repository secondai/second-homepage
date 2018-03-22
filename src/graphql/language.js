
import gql from 'graphql-tag'

let fragment = {};
let query = {};
let mutation = {};


// Mutations
mutation['newLanguage'] = gql`
	mutation (
		$record: CreateOneLanguagesInput!
	){
		language {
			create(
				record: $record
			) {
				recordId
			}
		}
	}
`

mutation['updateLanguage'] = gql`
	mutation (
		$record: UpdateByIdLanguagesInput!
	){
		language {
			updateById (
				record: $record
			) {
				recordId
			}
		}
	}
`



// Queries

query['languages'] = gql`
	query (
		$filter: FilterFindManyLanguagesInput
	) {
		viewer {
			language {
				many (
					filter: $filter
					sort: _ID_DESC
				) {
					_id
					slug
					title
					schemaCode
					schemaObj
					createdAt
					updatedAt
				}
			}
		}
	}
`

query['language'] = gql`
	query (
		$_id: MongoID!
	) {
		viewer {
			langauge {
				byId (
					_id: $_id
				) {
					_id
					slug
					title
					schemaCode
					schemaObj
					createdAt
					updatedAt
				}
			}
		}
	}
`

query['languageBySlug'] = gql`
	query (
		$slug: String
	) {
		viewer {
			language {
				one (
					filter: {
						slug: $slug
					}
				) {
					_id
					slug
					title
					schemaCode
					schemaObj
					createdAt
					updatedAt
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