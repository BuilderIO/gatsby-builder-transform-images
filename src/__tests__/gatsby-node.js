jest.mock(`gatsby-source-filesystem`);
import {
  createResolvers as pluginCreateResolvers,
} from "../gatsby-node";
import expect from "expect";

describe("createResolvers", () => {
  it("should define a resolver for the localFile field in builder_Model type", () => {
    const createResolvers = jest.fn();

    pluginCreateResolvers({ createResolvers, actions: {} }, { models: ['Page']});
    const argumentsFirstCall = createResolvers.mock.calls[0][0];

    expect(argumentsFirstCall['builder_Page']).not.toBeFalsy();
    expect(argumentsFirstCall['builder_Page'].localFiles).not.toBeFalsy();
  });
});
