import Foundation

@objc public class Filesystem: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
