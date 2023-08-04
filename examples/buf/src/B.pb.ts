// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// Source: B.proto
/* eslint-disable */

import type { ByteSource, PartialDeep } from "protoscript";
import { BinaryReader, BinaryWriter } from "protoscript";

import * as A from "./A.pb";

//========================================//
//                 Types                  //
//========================================//

export interface Bar {
  foo: A.Foo;
}

//========================================//
//        Protobuf Encode / Decode        //
//========================================//

export const Bar = {
  /**
   * Serializes Bar to protobuf.
   */
  encode: function (msg: PartialDeep<Bar>): Uint8Array {
    return Bar._writeMessage(msg, new BinaryWriter()).getResultBuffer();
  },

  /**
   * Deserializes Bar from protobuf.
   */
  decode: function (bytes: ByteSource): Bar {
    return Bar._readMessage(Bar.initialize(), new BinaryReader(bytes));
  },

  /**
   * Initializes Bar with all fields set to their default value.
   */
  initialize: function (): Bar {
    return {
      foo: A.Foo.initialize(),
    };
  },

  /**
   * @private
   */
  _writeMessage: function (
    msg: PartialDeep<Bar>,
    writer: BinaryWriter,
  ): BinaryWriter {
    if (msg.foo) {
      writer.writeMessage(1, msg.foo, A.Foo._writeMessage);
    }
    return writer;
  },

  /**
   * @private
   */
  _readMessage: function (msg: Bar, reader: BinaryReader): Bar {
    while (reader.nextField()) {
      const field = reader.getFieldNumber();
      switch (field) {
        case 1: {
          reader.readMessage(msg.foo, A.Foo._readMessage);
          break;
        }
        default: {
          reader.skipField();
          break;
        }
      }
    }
    return msg;
  },
};

//========================================//
//          JSON Encode / Decode          //
//========================================//

export const BarJSON = {
  /**
   * Serializes Bar to JSON.
   */
  encode: function (msg: PartialDeep<Bar>): string {
    return JSON.stringify(BarJSON._writeMessage(msg));
  },

  /**
   * Deserializes Bar from JSON.
   */
  decode: function (json: string): Bar {
    return BarJSON._readMessage(BarJSON.initialize(), JSON.parse(json));
  },

  /**
   * Initializes Bar with all fields set to their default value.
   */
  initialize: function (): Bar {
    return {
      foo: A.FooJSON.initialize(),
    };
  },

  /**
   * @private
   */
  _writeMessage: function (msg: PartialDeep<Bar>): Record<string, unknown> {
    const json: Record<string, unknown> = {};
    if (msg.foo) {
      const _foo_ = A.FooJSON._writeMessage(msg.foo);
      if (Object.keys(_foo_).length > 0) {
        json["foo"] = _foo_;
      }
    }
    return json;
  },

  /**
   * @private
   */
  _readMessage: function (msg: Bar, json: any): Bar {
    const _foo_ = json["foo"];
    if (_foo_) {
      A.FooJSON._readMessage(msg.foo, _foo_);
    }
    return msg;
  },
};