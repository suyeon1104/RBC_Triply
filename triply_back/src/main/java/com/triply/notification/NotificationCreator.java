package com.triply.notification;

public interface NotificationCreator<T> {
	NotificationEntity create(T target);
}
