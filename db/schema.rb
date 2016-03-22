# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160315200313) do

  create_table "sparql_endpoints", force: :cascade do |t|
    t.string   "name",       null: false
    t.text     "endpoint",   null: false
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "sparql_endpoints", ["user_id"], name: "index_sparql_endpoints_on_user_id"

  create_table "sparql_queries", force: :cascade do |t|
    t.string   "name",               null: false
    t.text     "query",              null: false
    t.integer  "user_id"
    t.integer  "parent_query_id"
    t.integer  "sparql_endpoint_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "sparql_queries", ["parent_query_id"], name: "index_sparql_queries_on_parent_query_id"
  add_index "sparql_queries", ["sparql_endpoint_id"], name: "index_sparql_queries_on_sparql_endpoint_id"
  add_index "sparql_queries", ["user_id"], name: "index_sparql_queries_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
