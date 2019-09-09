'use strict';
import {forEach, head, isArray, map, toLower, includes, isObject, assign} from 'lodash';
import {ModelType} from '../@types/index';

// The model that uses Knexjs to store and retrieve data from a
// database using the provided `knex` instance.
// Custom functionality can be composed on top of this set of models.
// The idea is that these are the most-used types of functions that most/all
// "models" will want to have. They can be overriden/modified/extended if
// needed by composing a new object out of the one returned by this function ;)

const ORDER_BY = [{column: 'id', order: 'asc'}];

const modelCreate = (model: ModelType) => {
    const {
        knex,
        name,
        tableName,
        selectableProps,
    } = model;
    let {timeout} = model;

    timeout = timeout || 10000;

    const jsonToString = (props: object) => {
        const objectToSave = {};
        // eslint-disable-next-line
        map(props, (value, index) => {
            if (includes(selectableProps, index)) {
                if (isObject(value)) {
                    assign(objectToSave, {[index]: JSON.stringify(value)});
                } else {
                    assign(objectToSave, {[index]: value});
                }
            }
            return;
        });

        return objectToSave;
    };

    const find = (filters = {}, columns = selectableProps) => knex.select(columns).from(tableName)
        .where(filters);

    const findOne = async (filters = {}, columns = selectableProps, orderBy = ORDER_BY) => {
        const results = await find(filters, columns);
        if (!isArray(results)) {
            return results;
        }
        return head(results);
    };

    const findAll = (columns = selectableProps, orderBy = ORDER_BY) => knex.select(columns)
        .from(tableName).orderBy(orderBy);

    const findById = (id: string , columns = selectableProps, orderBy = ORDER_BY) => knex.select(columns).from(tableName)
        .where({id}).orderBy(orderBy);

    const findByTerm = (termValue: string, termKeys: [string], filters: object, columns = selectableProps) => {
        if (isArray(termKeys)) {
            const knexQuery = knex.select(columns).from(tableName).where(function() {
                forEach(termKeys, (tk, i) => {
                    if (i === 0) {
                        this.whereRaw(`LOWER(${tk}::varchar) like ?`, [`%${toLower(termValue)}%`]);
                    } else {
                        this.orWhereRaw(`LOWER(${tk}::varchar) like ?`, [`%${toLower(termValue)}%`]);
                    }
                });
            });

            if (filters) {
                return knexQuery.andWhere(filters);
            }
            return knexQuery;
        }
    };
    const updateOne = async (filters: object, props: {id: string, __v: number}) => {
        delete props.id;
        const object = await findOne(filters);
        if (object && object.__v !== undefined) {
            props.__v = object.__v;
            props.__v += 1;
        } else {
            props.__v = 0;
        }

        const objectToSave = jsonToString(props);

        return knex.update(objectToSave).from(tableName).where(filters)
            .returning(selectableProps);
    };

    const updateMany = async (filters: object, props: object) => {
        if (isArray(props) && Object instanceof head(props)) {
            const updates = Promise.all(map(props, async (prop) => {
                delete prop.id;
                const object = await findOne(filters);
                if (object.__v !== undefined) {
                    prop.__v = object.__v;
                    prop.__v += 1;
                } else {
                    prop.__v = 0;
                }
                return jsonToString(prop);
            }));

            return knex.update(updates).from(tableName).where(filters)
                .returning(selectableProps);
        }
        return Promise.reject('not a valid array of data');
    };

    const deletedOne = (id: string) => knex.update({deleted: true, deletedat: Date.now})
        .from(tableName).where({id});

    const deletedMany = (ids: any) => {
        if (isArray(ids) && head(ids) instanceof String) {
            return knex.update({deleted: true, deletedat: Date.now})
                .from(tableName).whereIn('id', ids);
        }
    };

    const countDocuments = async (filters = {}) => {
        const {count} = head(await knex(tableName).count('id').where(filters));
        return count;
    };

    return {
        name,
        tableName,
        selectableProps,
        timeout,
        find,
        findAll,
        findOne,
        findById,
        findByTerm,
        updateOne,
        updateMany,
        deletedOne,
        deletedMany,
        countDocuments,
    };
};

export default modelCreate;
